export interface Env {
  (key: string, defaultValue?: any): any;
  int(key: string, defaultValue?: number): number;
  float(key: string, defaultValue?: number): number;
  bool(key: string, defaultValue?: boolean): boolean;
  json(key: string, defaultValue?: any): any;
  array(key: string, defaultValue?: any[]): any[];
  date(key: string, defaultValue?: Date): Date;
}

export interface ConfigContext {
  env: Env;
}
