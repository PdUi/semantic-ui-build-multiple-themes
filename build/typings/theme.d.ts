interface ITheme {
    name: string;
    primaryColor: IColor;
    secondaryColor: IColor;
}

interface IColor {
    color: string;
    description: string;
}

interface IThemeJson {
    themes: string[];
}
