export type TBtnList = {
    label: string;
    link: string;
    icon: string;
    newTab: boolean;
    labelDirection?: "left" | "right"
};

export type TProjectList = {
    id: number;
    name: string;
    description: string;
    date: string;
    demoLink: string;
};

export type TCoordinateStyle = {
    x: number | string;
    y: number | string;
};

export type TNavButtonProps = TCoordinateStyle & TBtnList;
export type TFormValue = {
    name: string;
    email: string;
    message: string;
}
export type TTemplateParams = {
    to_name: string;
    from_name: string;
    reply_to: string;
    message: string;
}
