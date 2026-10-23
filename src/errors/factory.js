const replaceParams = (message, params) => {
  return message.replace(/\{(\w+)\}/g, (placeholder, name) => {
    return Object.hasOwn(params, name)
      ? String(params[name])
      : placeholder;
  });
};

export const factory = (
  errors,
  {
    SYSTEM_INVALID_ERROR_CODE_TYPE,
    SYSTEM_UNKNOWN_ERROR_CODE,
    SYSTEM_INVALID_ERROR_PARAMETERS_TYPE,
    SYSTEM_MISSING_ERROR_PARAMETER,
  },
) => (code, params = {}) => {
  if (typeof code !== 'string') {
    throw new TypeError(
      replaceParams(SYSTEM_INVALID_ERROR_CODE_TYPE.message, {
        type: typeof code,
      }),
    );
  }

  const error = errors[code];

  if (!error) {
    throw new Error(
      replaceParams(SYSTEM_UNKNOWN_ERROR_CODE.message, {
        key: code,
      }),
    );
  }

  if (error.params.length > 0) {
    if (
      params === null ||
      typeof params !== 'object' ||
      Array.isArray(params)
    ) {
      const type =
        params === null
          ? 'null'
          : Array.isArray(params)
            ? 'array'
            : typeof params;

      throw new TypeError(
        replaceParams(SYSTEM_INVALID_ERROR_PARAMETERS_TYPE.message, {
          type,
        }),
      );
    }

    for (const name of error.params) {
      if (!Object.hasOwn(params, name) || params[name] === undefined) {
        throw new Error(
          replaceParams(SYSTEM_MISSING_ERROR_PARAMETER.message, {
            param: name,
          }),
        );
      }
    }
  }

  return replaceParams(error.message, params);
};