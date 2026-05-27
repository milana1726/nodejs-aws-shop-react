import axios from "axios";
import API_PATHS from "~/constants/apiPaths";

export const useImportFile = () => {
  const getSignedUrl = async (fileName: string) => {
    const token = localStorage.getItem("authorization_token");

    const response = await axios.get<string>(`${API_PATHS.import}/import`, {
      params: { name: fileName },
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    return response.data;
  };

  return { getSignedUrl };
};
