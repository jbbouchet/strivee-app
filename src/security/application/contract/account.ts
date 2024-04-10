/**
 * The Account interface creates an abstraction around the entity making the request.
 * This prevents direct coupling to a User entity, enabling the use of this interface to represent other entities
 * such as programs/applications calling our API routes.
 */
export interface Account<R = number | string> {
  /**
   * The module who provides this token.
   */
  readonly provider: string;

  /**
   * The account reference.
   */
  ref(): R;
}
