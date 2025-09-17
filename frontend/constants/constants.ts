export const tableauEmbeddedUrl = `${process.env.NEXT_PUBLIC_TABLEAU_SERVER_URL}/t/${process.env.NEXT_PUBLIC_TABLEAU_SITE_ID}/views/${process.env.NEXT_PUBLIC_TABLEAU_WORKBOOK_ID}/${process.env.NEXT_PUBLIC_TABLEAU_VIEW_NAME}`;
export const tableauUserName = `${process.env.NEXT_PUBLIC_TABLEAU_USER_NAME}`;

// Tableau Pulse メトリクス設定
export const pulseMetrics = [
  {
    id: "d6cb961b-76a9-46d1-b6d6-c4710d3b0186",
    name: "売上",
    description: "売上のメトリクス"
  },
  {
    id: "a1b0f9b5-5c85-420a-9a04-9ca32b012086",
    name: "利益",
    description: "利益のメトリクス"
  },
  {
    id: "6cdf2b36-c5ae-42a0-bfd2-f430a5529463",
    name: "オーダー数",
    description: "オーダー数のメトリクス"
  },
  // {
  //   id: "e0c5ad0a-30bc-4394-8e35-068e0637cc8b",
  //   name: "コンバージョン率",
  //   description: "月次コンバージョン率"
  // }
];

export const pulseSiteName = `${process.env.NEXT_PUBLIC_TABLEAU_SITE_ID}`;