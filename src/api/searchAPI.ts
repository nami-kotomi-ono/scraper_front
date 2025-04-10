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
  };
  error: string | null;
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

const getFilenameFromContentDisposition = (contentDisposition: string): string => {
  // UTF-8エンコードされたファイル名を優先
  const utf8Match = contentDisposition.match(/filename\*=UTF-8''(.+)/);
  if (utf8Match) {
    return decodeURIComponent(utf8Match[1]);
  }
  
  // 通常のファイル名
  const regularMatch = contentDisposition.match(/filename="(.+)"/);
  if (regularMatch) {
    return regularMatch[1];
  }
  
  throw new Error('ファイル名を取得できませんでした');
};

export const downloadCSV = async (filename: string): Promise<void> => {
  try {
    console.log(`/download/${filename}`)
    const response = await api.get(`/download/${filename}`, {
      responseType: 'blob',
    });

    // Content-Dispositionヘッダーからファイル名を取得
    const contentDisposition = response.headers['content-disposition'];
    if (!contentDisposition) {
      throw new Error('ダウンロードファイルの情報が取得できません');
    }

    const downloadFilename = getFilenameFromContentDisposition(contentDisposition);

    // BlobからURLを作成
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', downloadFilename);
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