import React, { useState } from 'react';
import { SearchForm } from '../components/SearchForm';
import { AnalysisResult } from '../components/AnalysisResult';
import { DownloadLink } from '../components/DownloadLink';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { searchProducts, SearchResponse } from '../api/searchAPI';
import { toast } from 'react-hot-toast';
import { Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResponse | null>(null);

  const handleSearch = async (keyword: string) => {
    setIsLoading(true);
    
    try {
      const result = await searchProducts(keyword);
      setSearchResult(result);
      
      if (result.error) {
        toast.error(result.error);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '予期せぬエラーが発生しました';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="flex flex-col items-center max-w-4xl mx-auto space-y-8">
          <div className="text-center w-full">
            <div className="flex justify-center mb-4">
              <Search size={48} className="text-blue-600" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">商品価格の分析</h1>
            <p className="text-sm md:text-base text-gray-600">検索キーワードを入力してください</p>
          </div>

          <div className="w-full flex justify-center">
            <SearchForm onSearch={handleSearch} isLoading={isLoading} />
          </div>

          {isLoading && (
            <div className="w-full flex justify-center">
              <LoadingSpinner />
            </div>
          )}

          {searchResult && (
            <div className="w-full space-y-6">
              <div className="flex justify-center">
                <AnalysisResult 
                  analysis={searchResult.analysis} 
                  error={searchResult.error}
                />
              </div>
              {!searchResult.error && (
                <div className="flex justify-center">
                  <DownloadLink filename={searchResult.filename} />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};