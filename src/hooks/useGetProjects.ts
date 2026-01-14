import { useQuery } from "@tanstack/react-query";
import { getProjectsData } from "../lib/data";

export const useGetProjects = () =>
  useQuery({
    queryKey: ["projects"],
    queryFn: getProjectsData,
  });
