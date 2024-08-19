export const title = `Review relevant NMDC environment schemas`;

// language=Markdown
export const info = `
Schema for biosamples based on MIxS and other standards
`;
// Mark nested list item with 'NESTEDLISTITEM'
const rawMarkdownContent = `
* [air](https://microbiomedata.github.io/submission-schema/AirInterface/)
* [built environment](https://microbiomedata.github.io/submission-schema/BuiltEnvInterface/)
* [host-associated](https://microbiomedata.github.io/submission-schema/HostAssociatedInterface/)
* [hydrocarbon resources - cores](https://microbiomedata.github.io/submission-schema/HcrCoresInterface/)
* [hydrocarbon resources - fluids swabs](https://microbiomedata.github.io/submission-schema/HcrFluidsSwabsInterface/)
* [microbial mat_biofilm](https://microbiomedata.github.io/submission-schema/BiofilmInterface/)
* [miscellaneous natural or artificial environment](https://microbiomedata.github.io/submission-schema/MiscEnvsInterface/)
* [plant-associated](https://microbiomedata.github.io/submission-schema/PlantAssociatedInterface/)
* [sediment](https://microbiomedata.github.io/submission-schema/SedimentInterface/)
* [soil](https://microbiomedata.github.io/submission-schema/SoilInterface/)
`;

export const markdownContent = rawMarkdownContent.trim();

export default markdownContent;
