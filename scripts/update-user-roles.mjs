import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function updateUserRoles() {
  try {
    console.log("🔄 Atualizando roles dos usuários existentes...");

    // Buscar todos os usuários sem role definida
    const usersToUpdate = await prisma.user.findMany({
      where: {
        role: null,
      },
    });

    console.log(
      `📊 Encontrados ${usersToUpdate.length} usuários para atualizar`
    );

    // Atualizar cada usuário
    for (const user of usersToUpdate) {
      const newRole = user.isAdmin ? "ADMIN" : "USER";

      await prisma.user.update({
        where: { id: user.id },
        data: { role: newRole },
      });

      console.log(`✅ Usuário ${user.email} atualizado para role: ${newRole}`);
    }

    console.log("🎉 Todos os usuários foram atualizados com sucesso!");

    // Mostrar estatísticas finais
    const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
    const userCount = await prisma.user.count({ where: { role: "USER" } });

    console.log(`📈 Estatísticas finais:`);
    console.log(`   • Admins: ${adminCount}`);
    console.log(`   • Users: ${userCount}`);
  } catch (error) {
    console.error("❌ Erro ao atualizar roles:", error);
  } finally {
    await prisma.$disconnect();
  }
}

updateUserRoles();
