import { prisma } from "../../shared/db";
import { AppError } from "../../shared/errors";
import { listOrdersForEmail } from "../orders/orders.service";

// Orders belong to the email used at checkout, so the account email is the link.
export async function listOrderHistory(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new AppError(401, "Log in to continue");
  return listOrdersForEmail(user.email);
}
