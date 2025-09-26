import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { UpdateEventSchema } from "@/lib/validations";
import { hasPermission, Permission, UserRole } from "@/lib/permissions";
import { revalidatePath } from "next/cache";

interface Props {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        registrations: {
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!event) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Erro ao buscar evento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: Props) {
  try {
    const user = await getAuthUser();
    if (
      !user ||
      !hasPermission(user.role as UserRole, Permission.EDIT_EVENTS)
    ) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const validation = UpdateEventSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Dados inválidos", details: validation.error.issues },
        { status: 400 }
      );
    }

    const event = await prisma.event.update({
      where: { id },
      data: validation.data,
    });

    // Revalidate pages that show events
    revalidatePath("/");
    revalidatePath("/admin/events");

    return NextResponse.json(event);
  } catch (error) {
    console.error("Erro ao atualizar evento:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Props) {
  try {
    const user = await getAuthUser();
    if (
      !user ||
      !hasPermission(user.role as UserRole, Permission.DELETE_EVENTS)
    ) {
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await params;

    // Verificamos primeiro se o evento existe
    const eventExists = await prisma.event.findUnique({
      where: { id },
    });

    if (!eventExists) {
      return NextResponse.json(
        { error: "Evento não encontrado" },
        { status: 404 }
      );
    }

    // Usamos transação para garantir que tudo seja excluído ou nada seja
    await prisma.$transaction(async (tx) => {
      // Primeiro excluímos todos os registros associados
      await tx.registration.deleteMany({
        where: { eventId: id },
      });

      // Depois excluímos o evento com segurança
      await tx.event.delete({
        where: { id },
      });
    });

    // Revalidate pages that show events
    revalidatePath("/");
    revalidatePath("/admin/events");

    return NextResponse.json({ message: "Evento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir evento:", error);

    // Tratamos erros específicos para dar feedback melhor
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint failed")) {
        return NextResponse.json(
          {
            error:
              "Não foi possível excluir o evento pois existem registros relacionados",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        { error: `Erro ao excluir evento: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
