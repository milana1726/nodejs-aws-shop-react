import axios from "axios";
import API_PATHS from "~/constants/apiPaths";

export const useImportFile = () => {
  const getSignedUrl = async (fileName: string) => {
    const response = await axios.get<{ url: string }>(
      `${API_PATHS.import}/import`,
      {
        params: { name: fileName },
      },
    );

    return response.data;
  };

  return { getSignedUrl };
};
