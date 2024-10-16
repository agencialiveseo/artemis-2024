# Diferenças entre Volumes Docker e Bind Mounts

## Introdução

Neste tutorial, vamos explorar as diferenças práticas entre:

- **Sem volume**: Executando um contêiner sem usar o parâmetro `-v`.
- **Bind Mount**: Usando `-v /pasta-host:/pasta-remota` para montar um diretório do host no contêiner.
- **Volume Nomeado**: Usando `-v volume:/pasta-remota` para montar um volume Docker nomeado.

Vamos entender como cada abordagem afeta a persistência de dados e a interação entre o host e o contêiner.

---

## 1: Executando um Contêiner Sem Volume

### Passo 1.1: Executar o Contêiner

Execute um contêiner baseado na imagem `alpine`:

```bash
docker run --name sem_volume -it alpine sh
```

```bash
docker run --name sem_volume -it alpine             sh
#          ^ nome                ^ nome da imagem   ^ comando a ser executado ao iniciar container
```

Isto iniciará um shell interativo dentro do contêiner.

---

*A partir daqui, é recomendado executar os comandos através do WSL ou em seu terminal linux, facilitando os testes com comandos como `cat`, `ls`, `echo`, etc.*.
No Windows, se a integração Docker + WSL for bem sucedida, você pode abrir o WSL no menu iniciar ou e executar o comando `wsl` num terminal para acessar o terminal do Linux.

---

### Passo 1.2: Criar um Arquivo Dentro do Contêiner

Dentro do contêiner, crie um arquivo chamado `arquivo.txt`:

```bash
echo "Este é um arquivo dentro do contêiner sem volume." > /arquivo.txt
```

Verifique o conteúdo do arquivo:

```bash
cat /arquivo.txt
```

**Saída esperada:**

```
Este é um arquivo dentro do contêiner sem volume.
```

### Passo 1.3: Sair e Remover o Contêiner

Saia do contêiner:

```bash
exit
```

Remova o contêiner:

```bash
docker rm sem_volume
```

### Passo 1.4: Recriar o Contêiner e Verificar o Arquivo

Execute novamente o contêiner:

```bash
docker run --name sem_volume -it alpine sh
```

Tente acessar o arquivo criado anteriormente:

```bash
cat /arquivo.txt
```

**Saída esperada:**

```
cat: can't open '/arquivo.txt': No such file or directory
```

### Conclusão

- **Dados não persistentes**: O arquivo criado não está mais disponível porque o sistema de arquivos do contêiner é descartado quando o contêiner é removido.
- **Uso adequado**: Adequado para aplicações onde não é necessário persistir dados além do ciclo de vida do contêiner.

---

## Parte 2: Usando Bind Mount (`-v /pasta-host:/pasta-remota`)

### Passo 2.1: Criar um Diretório no Host

Crie um diretório no seu sistema host:

```bash
mkdir ~/pasta
```

Crie um arquivo dentro deste diretório:

```bash
echo "Este é um arquivo no host." > ~/pasta/host.txt
```

### Passo 2.2: Executar o Contêiner com Bind Mount

Execute o contêiner, montando o diretório do host:

```bash
docker run --name bind_mount -it -v ~/pasta:/dados alpine sh
```

### Passo 2.3: Verificar Arquivos no Contêiner

Dentro do contêiner, liste os arquivos em `/dados`:

```bash
ls /dados
```

**Saída esperada:**

```
host.txt
```

Leia o conteúdo do arquivo:

```bash
cat /dados/host.txt
```

**Saída esperada:**

```
Este é um arquivo no host.
```

### Passo 2.4: Criar um Arquivo no Contêiner

Crie um novo arquivo dentro do contêiner:

```bash
echo "Este é um arquivo no contêiner." > /dados/container.txt
```

### Passo 2.5: Verificar Arquivo no Host

Saia do contêiner:

```bash
exit
```

No host, liste os arquivos:

```bash
ls ~/pasta
```

**Saída esperada:**

```
container.txt
host.txt
```

Leia o conteúdo do arquivo criado no contêiner:

```bash
cat ~/pasta/container.txt
```

**Saída esperada:**

```
Este é um arquivo no contêiner.
```

### Conclusão

- **Dados persistentes**: Os arquivos criados no contêiner persistem no host.
- **Sincronização bidirecional**: Alterações no host refletem no contêiner e vice-versa.
- **Uso adequado**: Ideal para desenvolvimento, quando é necessário compartilhar código ou dados entre o host e o contêiner.

---

## Parte 3: Usando Volume Nomeado (`-v volume:/pasta-remota`)

### Passo 3.1: Criar um Volume Docker

Crie um volume chamado `meu_volume`:

```bash
docker volume create meu_volume
```

### Passo 3.2: Executar o Contêiner com Volume Nomeado

Execute o contêiner, montando o volume:

```bash
docker run --name volume_nomeado -it -v meu_volume:/dados alpine sh
```

### Passo 3.3: Criar um Arquivo no Contêiner

Dentro do contêiner, crie um arquivo:

```bash
echo "Este é um arquivo no volume nomeado." > /dados/volume.txt
```

### Passo 3.4: Verificar Persistência dos Dados

Saia do contêiner:

```bash
exit
```

Remova o contêiner:

```bash
docker rm volume_nomeado
```

Recrie o contêiner:

```bash
docker run --name volume_nomeado -it -v meu_volume:/dados alpine sh
```

Verifique se o arquivo ainda existe:

```bash
cat /dados/volume.txt
```

**Saída esperada:**

```
Este é um arquivo no volume nomeado.
```

### Passo 3.5: Verificar Dados no Host (Opcional)

Os volumes nomeados são gerenciados pelo Docker e não estão diretamente acessíveis em um diretório específico como no bind mount. Para encontrar o caminho do volume (em sistemas Linux):

```bash
docker volume inspect meu_volume
```

**Saída esperada:**

```json
[
    {
        "CreatedAt": "2023-10-10T12:34:56Z",
        "Driver": "local",
        "Labels": {},
        "Mountpoint": "/var/lib/docker/volumes/meu_volume/_data",
        "Name": "meu_volume",
        "Options": {},
        "Scope": "local"
    }
]
```

**Nota**: Acessar diretamente os dados no `Mountpoint` não é recomendado.

### Conclusão

- **Dados persistentes**: Os dados persistem mesmo após a remoção do contêiner.
- **Gerenciado pelo Docker**: Os volumes nomeados são gerenciados pelo Docker, oferecendo melhor abstração e controle.
- **Uso adequado**: Ideal para armazenar dados de aplicações em produção, onde a persistência é crucial, mas não é necessário acessar diretamente os arquivos no host.

---

## Resumo das Diferenças

| Método               | Persistência de Dados | Acesso do Host | Uso Adequado                           |
|----------------------|-----------------------|----------------|-----------------------------------------|
| Sem Volume           | Não                   | Não            | Aplicações efêmeras                     |
| Bind Mount           | Sim                   | Sim            | Desenvolvimento e compartilhamento      |
| Volume Nomeado       | Sim                   | Não direto     | Produção e persistência de dados segura |

---

## Limpeza (Opcional)

Para remover os recursos criados:

```bash
# Remover contêineres
docker rm sem_volume bind_mount volume_nomeado

# Remover o volume
docker volume rm meu_volume

# Remover o diretório de bind mount
rm -rf ~/pasta
```

---

**Recomendações:**

- **Sem Volume**: Use quando não precisar persistir dados.
- **Bind Mount**: Use em ambientes de desenvolvimento ou quando precisar acessar diretamente os dados no host.
- **Volume Nomeado**: Use em ambientes de produção para garantir persistência e isolamento dos dados.

---

## Navegar pelo projeto
- [Apresentação do projeto](../README.md)
- **Módulo 1**: [Arquitetura da Aplicação](../dia1/README.md)
- **Módulo 2** [Introdução ao Docker](./README.md)
- - [Instalando docker em Linux / WSL](./1-instalar-wsl-e-docker.md)
- - [Instalando Docker Desktop em Windows / Mac](./1-instalando-docker-desktop.md)
- - [Como o Docker Funciona](./2-como-docker-funciona.md)
- - Docker Volume *(Você está aqui)*
- - [Docker Compose e MySQL 8](./3-docker-compose-e-mysql.md)
- **Módulo 3** [MySQL básico](../dia3/README.md)
- **Módulo 4** [Introdução ao NATS](../dia4/README.md)
- **Módulo 5**: [Introdução ao TypeScript com Projeto Prático](../dia5/README.md)
- **Módulo 6**: [Introdução ao NestJS e Criação do Gateway](../dia6/README.md)
- **Módulo 7**: [Aplicação de API com NestJS e NATS](../dia7/README.md)
