/**
 * Strategy: Interfaz para la traducción de paths.
 * Facilita el testing y la expansión a otras distros o Docker.
 */
export interface PathTranslator {
  translate(input: string): string;
}
