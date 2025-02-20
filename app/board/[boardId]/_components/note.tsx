import { useMutation } from '@liveblocks/react/suspense';
import { Kalam } from 'next/font/google';
import ContentEditable, { ContentEditableEvent } from 'react-contenteditable';
import { cn, colorToCss, getContrastingTextColor } from '@/lib/utils';
import { NoteLayer } from '@/types/canvas';


const font = Kalam({
  subsets: ['latin'],
  weight: ['400'],
});

const calculateFontSize = (width: number, height: number) => {
  const maxFontSize = 96;
  const scaleFactor = 0.15;
  const fontSizeBasedOnWidth = width * scaleFactor;
  const fontSizeBasedOnHeight = height * scaleFactor;

  return Math.min(fontSizeBasedOnWidth, fontSizeBasedOnHeight, maxFontSize);
}

interface NoteProps {
  id: string;
  layer: NoteLayer;
  onPointerDown: (e: React.PointerEvent, id: string) => void;
  selectionColor?: string;
};


export const Note = ({
  id,
  layer,
  onPointerDown,
  selectionColor
}: NoteProps) => {
  const { x, y, width, height, fill, value } = layer;

  const updateValue = useMutation((
    { storage },
    newValue: string
  ) => {
    const liveLayers = storage.get('layers');
    liveLayers.get(id)?.set('value', newValue);
  }, []);

  const handleContentChange = (e: ContentEditableEvent) => {
    updateValue(e.target.value);
  };

  return (
    <foreignObject
      x={x}
      y={y}
      width={width}
      height={height}
      onPointerDown={(e) => onPointerDown(e, id)}
      style={{
        outline: selectionColor ? `1px solid ${selectionColor}` : 'none',
        background: fill ? colorToCss(fill) : '#ccc',
      }}
      className='shadow-md drop-shadow-xl'
    >
      <ContentEditable 
        html={value || 'Text'}
        onChange={handleContentChange}
        className={cn(
          'w-full h-full flex justify-center items-center text-center outline-none',
          font.className
        )}
        style={{
          fontSize: calculateFontSize(width, height),
          color: fill ? getContrastingTextColor(fill) : '#000',
        }}
      />
    </foreignObject>
  );
};