import axios from "axios";
import type { Title } from "../types";

const API_URL = "http://localhost:5000/api/titles";

export const getTitles = async (): Promise<Title[]> => {
  const response = await axios.get<Title[]>(API_URL);
  return response.data;
};

export const createTitle = async (
  title: Omit<Title, "created_at">,
): Promise<Title> => {
  const response = await axios.post<Title>(API_URL, title);
  return response.data;
};
