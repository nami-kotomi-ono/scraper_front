import React from 'react';
import { Download } from 'lucide-react';
import { downloadCSV } from '../api/searchAPI';
import { toast } from 'react-hot-toast';

interface DownloadLinkProps {
  keyword: string;  // 検索キーワードを親コンポーネントから受け取る
}

export const DownloadLink: React.FC<DownloadLinkProps> = ({ keyword }) => {
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      await downloadCSV(keyword);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ダウンロードに失敗しました';
      toast.error(errorMessage);
      console.error('ダウンロードエラー:', error);
    }
  };

  return (
    <button
      onClick={handleDownload}
      className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
    >
      <Download size={20} />
      CSVをダウンロード
    </button>
  );
};