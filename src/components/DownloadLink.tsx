import React from 'react';
import { Download } from 'lucide-react';
import { downloadCSV } from '../api/searchAPI';
import { toast } from 'react-hot-toast';

interface DownloadLinkProps {
  filename: string | null;  // 検索APIのレスポンスから得られたfilename
}

export const DownloadLink: React.FC<DownloadLinkProps> = ({ filename }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!filename) {
      toast.error('ダウンロード可能なファイルが見つかりません');
      return;
    }

    try {
      await downloadCSV(filename);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ダウンロードに失敗しました';
      toast.error(errorMessage);
      console.error('ダウンロードエラー:', error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!filename}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
        filename
          ? 'bg-green-600 text-white hover:bg-green-700'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      }`}
    >
      <Download size={20} />
      CSVをダウンロード
    </button>
  );
};