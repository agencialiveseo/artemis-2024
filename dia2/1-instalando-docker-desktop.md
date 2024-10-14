# **Guia para instalação do Docker Desktop no Windows**

## **Requisitos:**
- Windows 10 (versão 1903 ou superior) ou Windows 11.
- Processador compatível com virtualização (Intel VT-x ou AMD-V).
- Ativar WSL 2 (Windows Subsystem for Linux 2).
- 4 GB de RAM ou mais.

## **Passo 1: Ativar a Virtualização**
Verifique se a virtualização está ativada no seu computador. A virtualização é essencial para que o Docker funcione corretamente.

1. Abra o "Gerenciador de Tarefas" (Ctrl + Shift + Esc).
2. Vá até a aba "Desempenho" e verifique se a "Virtualização" está ativada. Se não estiver, você precisará habilitá-la no BIOS.

## **Passo 2: Instalar WSL 2**
Se ainda não tiver o WSL2 instalado, siga os passos abaixo:

1. Abra o **PowerShell** como administrador.
2. Execute o comando para instalar o WSL:
   ```bash
   wsl --install
   ```
3. Isso instalará o WSL2 e a distribuição Ubuntu automaticamente. Reinicie o computador após a instalação, se necessário.

Para mais detalhes sobre a instalação do WSL, consulte a [Documentação da Microsoft](https://learn.microsoft.com/pt-br/windows/wsl/install).

## **Passo 3: Baixar e Instalar o Docker Desktop**
1. Acesse a página oficial do [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop/).
2. Baixe o instalador mais recente.
3. Após o download, execute o instalador.

Durante a instalação, verifique se as opções abaixo estão selecionadas:
- **Enable WSL 2 Windows Features** (Habilitar recursos do WSL 2).
- **Add Docker to the PATH** (Adicionar Docker ao PATH).

4. Clique em **Instalar** e aguarde a conclusão.

## **Passo 4: Configurar Docker para usar WSL 2**
1. Após a instalação, abra o Docker Desktop.
2. No painel do Docker, vá até as configurações (ícone de engrenagem) e selecione a aba **Resources > WSL Integration**.
3. Certifique-se de que a opção **Enable integration with my default WSL distro** está habilitada.
4. Selecione a distribuição do Ubuntu (ou outra que você estiver utilizando) para integração com o Docker.

## **Passo 5: Verificar a Instalação**
1. Abra o terminal do Ubuntu via WSL ou o PowerShell.
2. Execute o seguinte comando para verificar se o Docker foi instalado corretamente:
   ```bash
   docker --version
   ```
3. Teste o Docker executando a imagem de teste:
   ```bash
   docker run hello-world
   ```

Se a instalação estiver correta, você verá uma mensagem confirmando que o Docker foi executado com sucesso.

## **Passo 6: Iniciar e Usar o Docker Desktop**
- O Docker Desktop será iniciado automaticamente ao ligar o Windows. Você pode gerenciar contêineres e imagens Docker diretamente a partir da interface do Docker Desktop ou via terminal WSL.

Caso encontre algum problema, verifique a aba **Troubleshoot** no Docker Desktop ou consulte a [documentação oficial](https://docs.docker.com/desktop/windows/troubleshoot/) para resolver possíveis erros.


---

## Navegar pelo projeto
- [Apresentação do projeto](../README.md)
- **Módulo 1**: [Arquitetura da Aplicação](../dia1/README.md)
- **Módulo 2** [Introdução ao Docker](./README.md)
- - [Instalando docker em Linux / WSL](./1-instalar-wsl-e-docker.md)
- - Instalando Docker Desktop em Windows / Mac *(Você está aqui)*
- - [Como o Docker Funciona](./2-como-docker-funciona.md)
- - [Docker Volume](./2-docker-volume.md)
- - [Docker Compose e MySQL 8](./3-docker-compose-e-mysql.md)
- **Módulo 3** [MySQL básico](./dia3/README.md)
- **Módulo 4** [Introdução ao NATS](./dia4/README.md)
- **Módulo 5**: [Introdução ao TypeScript com Projeto Prático](./dia5/README.md)