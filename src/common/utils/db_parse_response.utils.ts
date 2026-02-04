export const parseDatabaseError = (error: any): string => {
  // --- PARSER PARA POSTGRESQL (TypeORM / pg) ---
  if (error.code) {
    switch (error.code) {
      case '23505': // Unique violation
        const detail = error.detail?.match(/\((.*?)\)=\((.*?)\)/);
        return detail
          ? `El valor '${detail[2]}' para el campo '${detail[1]}' ya existe.`
          : 'Violación de restricción única.';
      case '23503': // Foreign key violation
        return 'No se puede realizar la operación: referencia a un registro inexistente.';
      case '23502': // Not null violation
        return `El campo '${error.column}' no puede estar vacío.`;
    }
  }

  // --- PARSER PARA MONGODB (Mongoose) ---
  if (error.name === 'MongoServerError' || error.code === 11000) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      const value = error.keyValue[field];
      return `El registro con '${field}: ${value}' ya existe en el sistema.`;
    }
  }

  if (error.name === 'ValidationError') {
    // Mongoose Validation
    const messages = Object.values(error.errors).map((err: any) => err.message);
    return `Error de validación de datos: ${messages.join(', ')}`;
  }

  if (error.name === 'CastError') {
    // Mongoose Invalid ID
    return `El formato del ID '${error.value}' no es válido para MongoDB.`;
  }

  // Si no es un error conocido, devolvemos el mensaje original o uno genérico
  return (
    error.detail || error.message || 'Error de persistencia en la base de datos'
  );
};
