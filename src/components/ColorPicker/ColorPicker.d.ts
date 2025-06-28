import './ColorPicker.scss';
interface ColorPickerProps<T extends string> {
    colors: readonly T[];
    selectedColor: T;
    onSelect: (color: T) => void;
}
export declare const ColorPicker: <T extends string>({ colors, selectedColor, onSelect, }: ColorPickerProps<T>) => import("react/jsx-runtime").JSX.Element;
export {};
