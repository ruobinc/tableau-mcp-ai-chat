import { type FC } from 'react';

import { tableauUserName } from '../../../config/tableau';
import { JWTProvider } from '../../../providers/JWTProvider';
import { type TableauPulseEmbedProps } from '../types/tableau-types';
import TableauPulseMultiple from './TableauPulseMultiple';
import TableauPulseSingle from './TableauPulseSingle';

const TableauPulseEmbed: FC<TableauPulseEmbedProps> = ({
  mode = 'single',
  username,
  metricId,
  siteName,
  height,
  width,
  layout,
}) => {
  if (mode === 'multiple') {
    return (
      <JWTProvider defaultUsername={tableauUserName || 'default-user'} prefetchDefaultToken>
        <TableauPulseMultiple username={username} />
      </JWTProvider>
    );
  }

  return (
    <TableauPulseSingle
      username={username}
      metricId={metricId}
      siteName={siteName}
      height={height}
      width={width}
      layout={layout}
    />
  );
};

export default TableauPulseEmbed;
