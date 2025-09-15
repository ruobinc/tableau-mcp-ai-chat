export const tableauEmbeddedUrl = `${process.env.NEXT_PUBLIC_TABLEAU_SERVER_URL}/t/${process.env.NEXT_PUBLIC_TABLEAU_SITE_ID}/views/${process.env.NEXT_PUBLIC_TABLEAU_WORKBOOK_ID}/${process.env.NEXT_PUBLIC_TABLEAU_VIEW_NAME}`;
export const tableauUserName = `${process.env.NEXT_PUBLIC_TABLEAU_USER_NAME}`;

// Tableau Pulse メトリクス設定
export const pulseMetrics = [
  {
    id: "80bed8ec-9478-426b-a116-bcb3a6549b4b",
    name: "売上高",
    description: "月次売上高の推移"
  },
  {
    // id: "7a244538-afe3-47a1-86c0-e9060a6ae9cd",
    id: "7a244538-afe3-47a1-86c0-e9060a6ae9cd",
    name: "利益率",
    description: "月次利益率の推移"
  },
  {
    id: "b6890fa4-44ce-4df5-b7b1-8e75d27cf11f",
    // id: "ccc",
    name: "顧客数",
    description: "アクティブ顧客数の推移"
  },
  {
    id: "e0c5ad0a-30bc-4394-8e35-068e0637cc8b",
    // id: "aaa",
    name: "コンバージョン率",
    description: "月次コンバージョン率"
  }
];

export const pulseSiteName = `${process.env.NEXT_PUBLIC_TABLEAU_SITE_ID}`;