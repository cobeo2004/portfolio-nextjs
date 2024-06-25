export type TBtnList = {
    label: string;
    link: string;
    icon: string;
    newTab: boolean;
};

export type TProjectList = {
    id: number;
    name: string;
    description: string;
    date: string;
    demoLink: string;
};

export type TCoordinateStyle = {
    x: string;
    y: string;
};

export type TNavButtonProps = TCoordinateStyle & TBtnList;

