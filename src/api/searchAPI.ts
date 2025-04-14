import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // CORSリクエストでクレデンシャルを含める
});

export interface SearchResponse {
  analysis: {
    lowest_price: { price: string; name: string };
    highest_price: { price: string; name: string };
    average_price: number;
    median_price: number;
    total_items: number;
  } | null;
  error: string | null;
  filename: string | null;
}

interface ErrorResponse {
  detail: string;
}

export const searchProducts = async (keyword: string): Promise<SearchResponse> => {
  try {
    const response = await api.post<SearchResponse>('/search', { keyword });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      if (error.response) {
        // サーバーからのエラーレスポンス
        const errorMessage = error.response.data.detail || '予期せぬエラーが発生しました';
        throw new Error(errorMessage);
      } else if (error.request) {
        throw new Error('サーバーとの通信に失敗しました');
      } else {
        throw new Error('リクエストの設定中にエラーが発生しました');
      }
    }
    throw error;
  }
};

export const downloadCSV = async (filename: string): Promise<void> => {
  if (!filename) {
    throw new Error('ダウンロード可能なファイルが見つかりません');
  }

  try {
    const response = await api.get(`/download/${filename}`, {
      responseType: 'blob',
    });

    // BlobからURLを作成
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    if (axios.isAxiosError<ErrorResponse>(error)) {
      if (error.response) {
        const errorMessage = error.response.data.detail || 'ファイルのダウンロードに失敗しました';
        throw new Error(errorMessage);
      } else {
        throw new Error('サーバーとの通信に失敗しました');
      }
    }
    throw error;
  }
};