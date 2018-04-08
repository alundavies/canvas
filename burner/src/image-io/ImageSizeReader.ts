export interface ImageSizeReader {
    getSizePropertiesOf( imagePath: string) : Promise<ImageSizeProperties>;
};



