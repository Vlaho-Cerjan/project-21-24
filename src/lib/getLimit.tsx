import useWindowSize from '../utility/windowSize';

export const GetLimit = (width: number, limit: number | null, gridItemMaxWidth: string, setGridItemMaxWidth: (gridItemMaxWidth: string) => void) => {
    let tempLimit = 0;
    if(width < 450){
        if(limit !== 8) tempLimit = 8;
        if(gridItemMaxWidth !== "50%") setGridItemMaxWidth("50%");
    }
    if(width >= 450 && width < 674){
        if(limit !== 16) tempLimit = 16;
        if(gridItemMaxWidth !== "50%") setGridItemMaxWidth("50%");
    }
    if(width >= 674 && width < 900){
        if(limit !== 15) tempLimit = 15;
        if(gridItemMaxWidth !== "33.33%") setGridItemMaxWidth("33.33%");
    }
    if(width >= 900 && width < 1014){
        if(limit !== 16) tempLimit = 16;
        if(gridItemMaxWidth !== "50%") setGridItemMaxWidth("50%");
    }
    if(width >= 1014 && width < 1200){
        if(limit !== 15) tempLimit = 15;
        if(gridItemMaxWidth !== "33.33%") setGridItemMaxWidth("33.33%");
    }
    if(width >= 1200 && width < 1396){
        if(limit !== 16) tempLimit = 16;
        if(gridItemMaxWidth !== "50%") setGridItemMaxWidth("50%");
    }
    if(width >= 1396){
        if(limit !== 15) tempLimit = 15;
        if(gridItemMaxWidth !== "33.33%") setGridItemMaxWidth("33.33%");
    }

    if(tempLimit !== 0) return tempLimit;
    else return null;
}