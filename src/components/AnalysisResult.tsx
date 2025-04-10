import React from 'react';
import { TrendingUp, TrendingDown, Calculator, Package } from 'lucide-react';
import { SearchResponse } from '../api/searchAPI';

interface AnalysisResultProps {
  analysis: SearchResponse['analysis'];
  error?: string | null;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, error }) => {
  if (error || !analysis) {
    return (
      <div className="analysis-container">
        <div className="analysis-card">
          <div className="analysis-error">
            {error || '分析結果がありません'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-container">
      <div className="analysis-card">
        <div className="analysis-header">
          <TrendingDown className="text-green" />
          <h3 className="analysis-title">最安値</h3>
        </div>
        <p className="analysis-price text-green-600">{analysis.lowest_price.price}</p>
        <p className="analysis-product-name">{analysis.lowest_price.name}</p>
      </div>

      <div className="analysis-card">
        <div className="analysis-header">
          <TrendingUp className="text-red" />
          <h3 className="analysis-title">最高値</h3>
        </div>
        <p className="analysis-price text-red-600">{analysis.highest_price.price}</p>
        <p className="analysis-product-name">{analysis.highest_price.name}</p>
      </div>

      <div className="analysis-card">
        <div className="analysis-header">
          <Calculator className="text-blue" />
          <h3 className="analysis-title">価格統計</h3>
        </div>
        <div className="analysis-stats">
          <p className="analysis-stat-text">
            平均価格: <span className="font-semibold">¥{analysis.average_price.toLocaleString()}</span>
          </p>
          <p className="analysis-stat-text">
            中央値: <span className="font-semibold">¥{analysis.median_price.toLocaleString()}</span>
          </p>
        </div>
      </div>

      <div className="analysis-card">
        <div className="analysis-header">
          <Package className="text-purple" />
          <h3 className="analysis-title">検索結果数</h3>
        </div>
        <p className="analysis-price text-purple-600">{analysis.total_items}</p>
        <p className="analysis-product-name">件の商品が見つかりました</p>
      </div>
    </div>
  );
};