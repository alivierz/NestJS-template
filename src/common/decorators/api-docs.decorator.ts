import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiParamOptions,
  ApiQueryOptions,
} from '@nestjs/swagger';

interface ApiDocsOptions {
  summary: string;
  description?: string;
  body?: Type<any>;
  params?: ApiParamOptions[];
  queries?: ApiQueryOptions[];
  isPublic?: boolean;
  successResponse?: {
    status: number;
    description: string;
    model?: any; // Puede ser una clase DTO o un objeto de ejemplo
    message?: string;
    tracking?: string;
  };
  errorResponses?: {
    status: number;
    description: string;
    tracking?: string;
    message?: string;
  }[];
}

export function ApiDocs(options: ApiDocsOptions) {
  const decorators = [
    ApiOperation({
      summary: options.summary,
      description: options.description,
    }),
  ];

  // Seguridad: Candado de Bearer Token
  if (!options.isPublic) decorators.push(ApiBearerAuth());

  // Cuerpo de la petición (Editable en Scalar)
  if (options.body) decorators.push(ApiBody({ type: options.body }));

  // Parámetros de Ruta (/:id) - Los hace editables
  if (options.params) {
    options.params.forEach((p) => decorators.push(ApiParam(p)));
  }

  // Parámetros de Query (?search=...) - Los hace editables
  if (options.queries) {
    options.queries.forEach((q) => decorators.push(ApiQuery(q)));
  }

  // 1. RESPUESTA EXITOSA
  if (options.successResponse) {
    decorators.push(
      ApiResponse({
        status: options.successResponse.status,
        description: options.successResponse.description,
        schema: {
          example: {
            // Si model es una clase, Scalar intentará mostrar su estructura
            data: options.successResponse.model || {},
            message: options.successResponse.message || 'Operación exitosa',
            tracking: options.successResponse.tracking || 'SUCCESS000',
            // El token se muestra aunque no sea null, simulando persistencia
            token: options.isPublic
              ? null
              : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            timestamp: new Date().toISOString(),
          },
        },
      }),
    );
  }

  // 2. RESPUESTAS DE ERROR
  const defaultErrors = [{ status: 400, description: 'Error de validación' }];
  const errors = options.errorResponses || defaultErrors;

  errors.forEach((err: any) => {
    decorators.push(
      ApiResponse({
        status: err.status,
        description: err.description,
        schema: {
          example: {
            data: {},
            tracking: err.tracking || `ERROR${err.status}`,
            token: options.isPublic
              ? null
              : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            message: err.message || 'Descripción del error',
            timestamp: new Date().toISOString(),
          },
        },
      }),
    );
  });

  return applyDecorators(...decorators);
}
