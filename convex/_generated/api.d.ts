/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as ciclos from "../ciclos.js";
import type * as historico from "../historico.js";
import type * as mandalas from "../mandalas.js";
import type * as presets from "../presets.js";
import type * as sessoes from "../sessoes.js";
import type * as usagePatterns from "../usagePatterns.js";
import type * as userSessions from "../userSessions.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  ciclos: typeof ciclos;
  historico: typeof historico;
  mandalas: typeof mandalas;
  presets: typeof presets;
  sessoes: typeof sessoes;
  usagePatterns: typeof usagePatterns;
  userSessions: typeof userSessions;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
