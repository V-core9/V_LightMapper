export interface V_LightMapper_Interface {
  protocol: string,
  host: string,
  xmlPath: string,
  reportsDir: string,
  save_to_file?: boolean,
  headless?: boolean,
  onlyCategories: string[],
  reports_dir?: string,
  customRootResultTemplate?: string,
  doneAfter?: number,
  maxParallelNumber?: number,
}


export interface InnerOption {
  logLevel: string,
  output: string,
  port: number,
  onlyCategories?: string[],
}


export interface ResultsObject {
  startTime: number | null,
  endTime: number | null,
  execTime: number | null,
  pageRes: any[],
  config?: V_LightMapper_Interface,
}


export interface ShortDataInterface {
  name: string,
  perf: number | any,
  bp: number | any,
  seo: number | any,
  acc: number | any,
  pwa: number | any
}
