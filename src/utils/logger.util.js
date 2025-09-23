"use client";
export const log = (message, ...optionalParams) =>
  console.log(message, ...optionalParams);

export const error = (message, ...optionalParams) =>
  console.error(message, ...optionalParams);
