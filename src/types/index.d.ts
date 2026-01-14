export type TBtnList = {
  label: string;
  link: string;
  icon: string;
  newTab: boolean;
  labelDirection?: "left" | "right";
};

export type TProjectList = {
  id: number;
  name: string;
  full_name: string;
  description: string;
  date: string;
  language: string;
  is_template: boolean;
  stargazers_count: number;
  watchers_count: number;
  html_url: string;
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
};
export type TTemplateParams = {
  to_name: string;
  from_name: string;
  reply_to: string;
  message: string;
};

export type TMusic = {
  id: number;
  name: string;
  description: string;
  artist: string;
  musicUrl: string;
  coverUrl: string;
};
