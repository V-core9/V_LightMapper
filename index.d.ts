export interface V_Lightmapper_Config {
  protocol: string,
  host: string,
  path: string,
  reportsDir: string,
  save_to_file?: boolean,
  headless?: boolean,
  onlyCategories: string[],
  reports_dir?: string,
  customRootResultTemplate?: string
}


export interface InnerOption {
  logLevel: string,
  output: string,
  port: number,
  onlyCategories?: string[],
}


export interface ResultsObject {
  startTime: number|null,
  endTime: number|null,
  execTime: number|null,
  pageRes: any[],
  config?: V_Lightmapper_Config,
}


export interface ShortDataInterface {
  name: string,
  perf: number | any,
  bp: number | any,
  seo: number | any,
  acc: number | any,
  pwa: number | any
}
