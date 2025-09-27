const serverUrl = import.meta.env.VITE_TABLEAU_SERVER_URL?.trim() ?? '';
const siteId = import.meta.env.VITE_TABLEAU_SITE_ID?.trim() ?? '';
const workbookId = import.meta.env.VITE_TABLEAU_WORKBOOK_ID?.trim() ?? '';
const viewName = import.meta.env.VITE_TABLEAU_VIEW_NAME?.trim() ?? '';

export const tableauEmbeddedUrl =
  serverUrl && siteId && workbookId && viewName
    ? `${serverUrl}/t/${siteId}/views/${workbookId}/${viewName}`
    : '';

export const tableauUserName = (import.meta.env.VITE_TABLEAU_USER_NAME ?? '').trim();

export const pulseMetrics = [
  {
    id: 'd6cb961b-76a9-46d1-b6d6-c4710d3b0186',
    name: '売上',
    description: '売上のメトリクス'
  },
  {
    id: 'a1b0f9b5-5c85-420a-9a04-9ca32b012086',
    name: '利益',
    description: '利益のメトリクス'
  },
  {
    id: '6cdf2b36-c5ae-42a0-bfd2-f430a5529463',
    name: 'オーダー数',
    description: 'オーダー数のメトリクス'
  }
];

export const pulseSiteName = siteId;