export const setSidebarItems = (
    items: {
        [key: string]: string
    } | string[],
    setItems: (value: React.SetStateAction<{
        id: string;
        title: string;
    }[]>) => void
) => {
    if (typeof items !== "undefined") {
        const tempItemsSorted = Object.entries(items).map(value => {
            return {
                id: value[0].toLowerCase(),
                title: value[1].charAt(0).toUpperCase() + value[1].slice(1)
            };
        })

        setItems(tempItemsSorted);
    }
}