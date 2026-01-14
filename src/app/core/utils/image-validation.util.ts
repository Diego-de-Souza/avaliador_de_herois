/**
 * Utilitário para validação de imagens
 * Valida tipo, tamanho e dimensões de arquivos de imagem
 */

export interface ImageValidationResult {
  valid: boolean;
  error?: string;
  width?: number;
  height?: number;
  size?: number;
}

export interface ImageValidationOptions {
  maxSizeMB?: number;
  maxWidth?: number;
  maxHeight?: number;
  minWidth?: number;
  minHeight?: number;
  allowedTypes?: string[];
  requiredAspectRatio?: number; // width/height
}

export class ImageValidationUtil {
  private static readonly DEFAULT_MAX_SIZE_MB = 5;
  private static readonly DEFAULT_MAX_WIDTH = 2000;
  private static readonly DEFAULT_MAX_HEIGHT = 2000;
  private static readonly DEFAULT_MIN_WIDTH = 64;
  private static readonly DEFAULT_MIN_HEIGHT = 64;
  private static readonly DEFAULT_ALLOWED_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  /**
   * Valida um arquivo de imagem
   * @param file - Arquivo a ser validado
   * @param options - Opções de validação
   * @returns Promise com resultado da validação
   */
  static async validateImage(
    file: File,
    options: ImageValidationOptions = {}
  ): Promise<ImageValidationResult> {
    const {
      maxSizeMB = this.DEFAULT_MAX_SIZE_MB,
      maxWidth = this.DEFAULT_MAX_WIDTH,
      maxHeight = this.DEFAULT_MAX_HEIGHT,
      minWidth = this.DEFAULT_MIN_WIDTH,
      minHeight = this.DEFAULT_MIN_HEIGHT,
      allowedTypes = this.DEFAULT_ALLOWED_TYPES,
      requiredAspectRatio
    } = options;

    // Validar tipo de arquivo
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipo de arquivo não permitido. Tipos aceitos: ${allowedTypes.join(', ')}`
      };
    }

    // Validar tamanho
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`,
        size: file.size
      };
    }

    // Validar dimensões
    return new Promise((resolve) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(objectUrl);

        const width = img.width;
        const height = img.height;

        // Validar dimensões mínimas
        if (width < minWidth || height < minHeight) {
          resolve({
            valid: false,
            error: `Imagem muito pequena. Dimensões mínimas: ${minWidth}x${minHeight}px`,
            width,
            height
          });
          return;
        }

        // Validar dimensões máximas
        if (width > maxWidth || height > maxHeight) {
          resolve({
            valid: false,
            error: `Imagem muito grande. Dimensões máximas: ${maxWidth}x${maxHeight}px`,
            width,
            height
          });
          return;
        }

        // Validar aspect ratio se especificado
        if (requiredAspectRatio) {
          const aspectRatio = width / height;
          const tolerance = 0.1; // 10% de tolerância
          if (Math.abs(aspectRatio - requiredAspectRatio) > tolerance) {
            resolve({
              valid: false,
              error: `Proporção da imagem incorreta. Esperado: ${requiredAspectRatio}:1`,
              width,
              height
            });
            return;
          }
        }

        resolve({
          valid: true,
          width,
          height,
          size: file.size
        });
      };

      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({
          valid: false,
          error: 'Arquivo não é uma imagem válida'
        });
      };

      img.src = objectUrl;
    });
  }

  /**
   * Converte imagem para base64
   * @param file - Arquivo de imagem
   * @param maxSizeMB - Tamanho máximo antes de comprimir
   * @param quality - Qualidade da compressão (0-1)
   * @returns Promise com base64 da imagem
   */
  static async imageToBase64(
    file: File,
    maxSizeMB: number = 1,
    quality: number = 0.8
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result as string;
        
        // Se a imagem for muito grande, comprimir
        if (file.size > maxSizeMB * 1024 * 1024) {
          this.compressImage(result, quality)
            .then(compressed => resolve(compressed))
            .catch(reject);
        } else {
          resolve(result);
        }
      };

      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Comprime uma imagem
   * @param base64 - Imagem em base64
   * @param quality - Qualidade da compressão (0-1)
   * @returns Promise com base64 comprimido
   */
  private static async compressImage(
    base64: string,
    quality: number = 0.8
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Não foi possível criar contexto do canvas'));
          return;
        }

        // Redimensionar se necessário (max 1920px)
        const maxDimension = 1920;
        let width = img.width;
        let height = img.height;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = (height * maxDimension) / width;
            width = maxDimension;
          } else {
            width = (width * maxDimension) / height;
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Converter para base64 com compressão
        const compressed = canvas.toDataURL('image/jpeg', quality);
        resolve(compressed);
      };

      img.onerror = reject;
      img.src = base64;
    });
  }

  /**
   * Valida dimensões específicas (ex: 64x64 para ícones)
   */
  static async validateExactDimensions(
    file: File,
    requiredWidth: number,
    requiredHeight: number
  ): Promise<ImageValidationResult> {
    return this.validateImage(file, {
      minWidth: requiredWidth,
      maxWidth: requiredWidth,
      minHeight: requiredHeight,
      maxHeight: requiredHeight
    });
  }
}
