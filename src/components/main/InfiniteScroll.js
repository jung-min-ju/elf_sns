import { AutoSizer, CellMeasurer, CellMeasurerCache, InfiniteLoader, List, WindowScroller } from 'react-virtualized';
import { useCallback, useState, cloneElement } from 'react';


const InfiniteScroll = ({contentsData, loadPage, defaultHeight, defaultLoadPage, totalPage, children}) => {
    //콘텐츠 데이터, 콘텐츠 페이지 로드 함수, 콘텐츠 기본 높이, 한번에 로드할 페이지 수, 총 페이지 수
    const [cache, setCache] = useState(
        new CellMeasurerCache({
            fixedWidth: true,
            defaultHeight: defaultHeight,
        })
    );
    const rowCount = contentsData.length + (contentsData.length >= totalPage ? 0 : defaultLoadPage);

    const handleResize = useCallback(
        ({ width }) => {
            setCache((prevCache) => {
                return new CellMeasurerCache({
                    fixedWidth: true,
                    defaultHeight: prevCache.defaultHeight, 
                    defaultWidth: width
                });
            });
        },
        []
    );

    const isRowLoaded = useCallback(({ index })=>{
        return !!contentsData[index];
    },[contentsData])
      
    const loadMoreRows = useCallback(() => {
        loadPage(defaultLoadPage);
    },[loadPage,defaultLoadPage]);
      
    const rowRenderer = useCallback(({ index, key, parent, style }) => {
        const content = contentsData[index];
        
        return (
            <CellMeasurer
            key={key}
            cache={cache}
            parent={parent}
            rowIndex={index}
          >
            {({ measure }) => <div onLoad={()=>measure} style={style}>{cloneElement(children, {data:content})}</div>}
          </CellMeasurer>
        );
    },[contentsData, cache, children]);

    return (
        <WindowScroller>
            {({ height, isScrolling, onChildScroll, scrollTop }) => (
                <InfiniteLoader 
                    isRowLoaded={isRowLoaded}
                    loadMoreRows={loadMoreRows}
                    rowCount={rowCount}
                >
                    {({ onRowsRendered, registerChild }) => (
                                <AutoSizer disableHeight onResize={handleResize}>
                                    {({width}) => (
                                        <List
                                            autoHeight={true}
                                            height={height}
                                            width= {width}
                                            isScrolling={isScrolling}
                                            onScroll={onChildScroll}
                                            scrollTop={scrollTop}
                                            deferredMeasurementCache={cache}
                                            rowHeight={cache.rowHeight}
                                            rowRenderer={rowRenderer}
                                            rowCount={rowCount}
                                            ref={registerChild}
                                            onRowsRendered={onRowsRendered}
                                        />
                                    )}
                                </AutoSizer>
                    )}
                </InfiniteLoader>
            )}
        </WindowScroller>
    )
}

export default InfiniteScroll;