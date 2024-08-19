export const title = `What to consider reviewing prior to going into the field`;

// language=Markdown
export const info = ``;
// Mark nested list item with 'NESTEDLISTITEM'
const rawMarkdownContent = `
* Review the NMDC metadata requirements for your sample type(s)  
  * NESTEDLISTITEM Review standard descriptors/ontologies to ensure you obtain the most accurate observations  
* Obtain topographical and geographical information for your sampling sites if that data will not be measured or recorded while on site  
* Test and calibrate all tools prior to use in the field  
  * NESTEDLISTITEM Know how to read measurements from each specific tool you plan to use (e.g., compass, pH testing strips, maps)  
* Consider setting up a study in the app prior to going out into the field  
* Consider entering a test sample into the app to get familiar with the process and information needed  
* Review the CARE principles for proper data sovereignty for indigenous land. This figure from the Geological Society of America describes other aspects of [Field Ethics](https://www.geosociety.org/GSA/Education_Careers/GSA/edu-career/fieldethics.aspx?hkey=de4690fb-49ef-460a-8e86-21797ea969d8)

![Field Ethics and Sampling Checklist](assets/images/field-ethics.png)
`;

export const markdownContent = rawMarkdownContent.trim();

export default markdownContent;
