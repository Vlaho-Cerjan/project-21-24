export interface RowItem {
    id: string,
    layout_row_id: string,
    content_id: string,
    type: string,
    title: string,
    description: string,
    image: boolean,
    logo: string,
    order: number,
    data: {
        content_type: string,
        hide_title: boolean,
        hide_description: boolean,
        long_description: string | null,
        text_color: string,
        description_color: string,
    },
    created_at: string,
    updated_at: string,
}