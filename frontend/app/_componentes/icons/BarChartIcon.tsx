// components/icons/BarChartIcon.tsx
interface BarChartIconProps {
  isActive: boolean;
  size?: number;
}

const BarChartIcon = ({ isActive, size = 20 }: BarChartIconProps) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className='flex-shrink-0'
  >
    <path
      d='M18 20V10'
      stroke={isActive ? '#1d4ed8' : '#6b7280'}
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M12 20V4'
      stroke={isActive ? '#1d4ed8' : '#6b7280'}
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
    <path
      d='M6 20V14'
      stroke={isActive ? '#1d4ed8' : '#6b7280'}
      strokeWidth='3'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

export default BarChartIcon;
