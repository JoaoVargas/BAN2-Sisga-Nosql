from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import datetime as dt
import json

from connection import get_conn
db = get_conn()

app = Flask(__name__)
CORS(app)





# Sistema
@app.route('/', methods=['GET'])
def health_check():
  return jsonify({"message": "Healthy"})

@app.route('/inicializar', methods=['GET'])
def inicializar():
    # Verificar se o banco já está inicializado
    if db['pessoas'].count_documents({}) > 0 and db['disciplinas'].count_documents({}) > 0:
        return jsonify({'error': 'Banco já inicializado'})

    # Carregar dados do arquivo JSON
    with open('./inicializador.json', 'r') as file:
        data = json.load(file)

    # Inserção dos dados no MongoDB
    try:
        # db.createCollection("alunos");
        # db.createCollection("coordenadores");
        # db.createCollection("curso_disciplinas");
        # db.createCollection("cursos");
        # db.createCollection("disciplinas");
        # db.createCollection("historicos");
        # db.createCollection("pessoas");
        # db.createCollection("professores");
        # db.createCollection("relatorios");
        # db.createCollection("turmas");

        
        db['pessoas'].insert_many(data["pessoas"])
        db['coordenadores'].insert_many(data["coordenadores"])
        db['professores'].insert_many(data["professores"])
        db['alunos'].insert_many(data["alunos"])
        db['cursos'].insert_many(data["cursos"])
        db['disciplinas'].insert_many(data["disciplinas"])
        db['curso_disciplinas'].insert_many(data["curso_disciplinas"])
        db['turmas'].insert_many(data["turmas"])
        db['relatorios'].insert_many(data["relatorios"])
        db['historicos'].insert_many(data["historicos"])
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return jsonify({'message': 'Banco inicializado com sucesso'})





# Pessoas
pessoas_collection = db['pessoas']

@app.route('/pessoas', methods=['GET'])
def get_pessoas():
    pessoas = list(pessoas_collection.find({}, {'_id': 0}))  # Exclui o campo '_id' na resposta
    return jsonify(pessoas)

# Rota para buscar uma pessoa por CPF
@app.route('/pessoas/<cpf>', methods=['GET'])
def get_pessoa(cpf):
    pessoa = pessoas_collection.find_one({'cpf': cpf}, {'_id': 0})
    if pessoa:
        return jsonify(pessoa)
    return jsonify({'error': 'Pessoa não encontrada'}), 404

# Rota para criar uma nova pessoa
@app.route('/pessoas', methods=['POST'])
def create_pessoa():
    data = request.json
    result = pessoas_collection.insert_one(data)
    return jsonify({'message': 'Pessoa criada com sucesso', 'id': str(result.inserted_id)}), 201

# Rota para atualizar uma pessoa existente
@app.route('/pessoas/<cpf>', methods=['PUT'])
def update_pessoa(cpf):
    data = request.json
    result = pessoas_collection.update_one({'cpf': cpf}, {'$set': data})
    if result.matched_count > 0:
        return jsonify({'message': 'Pessoa atualizada com sucesso'})
    return jsonify({'error': 'Pessoa não encontrada'}), 404

# Rota para deletar uma pessoa
@app.route('/pessoas/<cpf>', methods=['DELETE'])
def delete_pessoa(cpf):
    result = pessoas_collection.delete_one({'cpf': cpf})
    if result.deleted_count > 0:
        return jsonify({'message': 'Pessoa deletada com sucesso'})
    return jsonify({'error': 'Pessoa não encontrada'}), 404




# Coordenadores
coordenadores_collection = db['coordenadores']

@app.route('/coordenadores', methods=['GET'])
def get_coordenadores():
    coordenadores = list(coordenadores_collection.find({}, {'_id': 0}))  # Exclui o campo '_id' nas respostas
    return jsonify(coordenadores)

@app.route('/coordenadores/<int:cod_coordenador>', methods=['GET'])
def get_coordenador(cod_coordenador):
    coordenador = coordenadores_collection.find_one({'cod_coordenador': cod_coordenador}, {'_id': 0})
    if coordenador:
        return jsonify(coordenador)
    return jsonify({'error': 'Coordenador não encontrado'}), 404

@app.route('/coordenadores', methods=['POST'])
def create_coordenador():
    data = request.json
    # Adicionar lógica para gerar automaticamente o campo `cod_coordenador` (se necessário)
    ultimo_cod = coordenadores_collection.find_one(sort=[('cod_coordenador', -1)])
    data['cod_coordenador'] = (ultimo_cod['cod_coordenador'] + 1) if ultimo_cod else 1
    
    coordenadores_collection.insert_one(data)
    return jsonify({'cod_coordenador': data['cod_coordenador']}), 201

@app.route('/coordenadores/<int:cod_coordenador>', methods=['PUT'])
def update_coordenador(cod_coordenador):
    data = request.json
    result = coordenadores_collection.update_one(
        {'cod_coordenador': cod_coordenador},
        {'$set': data}
    )
    if result.matched_count > 0:
        return jsonify({'message': 'Coordenador atualizado com sucesso'})
    return jsonify({'error': 'Coordenador não encontrado'}), 404

@app.route('/coordenadores/<int:cod_coordenador>', methods=['DELETE'])
def delete_coordenador(cod_coordenador):
    result = coordenadores_collection.delete_one({'cod_coordenador': cod_coordenador})
    if result.deleted_count > 0:
        return jsonify({'message': 'Coordenador deletado com sucesso'})
    return jsonify({'error': 'Coordenador não encontrado'}), 404




# Auxiliar Coordenadores
@app.route('/coordenadorespessoas', methods=['GET'])
def get_coordenadorespessoas():
    coordenadores = list(db['coordenadores'].aggregate([
        {
            "$lookup": {
                "from": "pessoas",
                "localField": "cpf",
                "foreignField": "cpf",
                "as": "pessoa_info"
            }
        },
        {
            "$unwind": {
                "path": "$pessoa_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": 0,
                "cod_coordenador": 1,
                "cpf": 1,
                "salario": 1,
                "pessoa_info.nome": 1,
                "pessoa_info.email": 1,
                "pessoa_info.data_nascimento": 1,
                "pessoa_info.sexo": 1,
                "pessoa_info.cep": 1,
                "pessoa_info.telefone": 1
            }
        }
    ]))
    return jsonify(coordenadores)

@app.route('/coordenadorespessoas/<int:cod_coordenador>', methods=['GET'])
def get_coordenadorpessoa(cod_coordenador):
    coordenador = db['coordenadores'].aggregate([
        {
            "$match": {"cod_coordenador": cod_coordenador}
        },
        {
            "$lookup": {
                "from": "pessoas",
                "localField": "cpf",
                "foreignField": "cpf",
                "as": "pessoa_info"
            }
        },
        {
            "$unwind": {
                "path": "$pessoa_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": 0,
                "cod_coordenador": 1,
                "cpf": 1,
                "salario": 1,
                "pessoa_info.nome": 1,
                "pessoa_info.email": 1,
                "pessoa_info.data_nascimento": 1,
                "pessoa_info.sexo": 1,
                "pessoa_info.cep": 1,
                "pessoa_info.telefone": 1
            }
        }
    ])
    result = list(coordenador)
    if result:
        return jsonify(result[0])
    return jsonify({'error': 'Coordenador não encontrado'}), 404

@app.route('/coordenadorespessoas/<int:cod_coordenador>', methods=['PUT'])
def update_coordenadorpessoa(cod_coordenador):
    data = request.json
    result_pessoa = db['pessoas'].update_one(
        {"cpf": data['cpf']},
        {"$set": {
            "nome": data['nome'],
            "email": data['email'],
            "data_nascimento": data['data_nascimento'],
            "sexo": data['sexo'],
            "cep": data['cep'],
            "telefone": data['telefone']
        }}
    )
    result_coordenador = db['coordenadores'].update_one(
        {"cod_coordenador": cod_coordenador},
        {"$set": {"salario": data['salario']}}
    )
    if result_pessoa.matched_count > 0 and result_coordenador.matched_count > 0:
        return jsonify({'message': 'Pessoa e Coordenador atualizados com sucesso'})
    return jsonify({'error': 'Atualização falhou'}), 404

@app.route('/coordenadorespessoas', methods=['POST'])
def create_coordenadorpessoa():
    data = request.json
    pessoa_data = {
        "cpf": data['cpf'],
        "nome": data['nome'],
        "email": data['email'],
        "data_nascimento": data['data_nascimento'],
        "sexo": data['sexo'],
        "cep": data['cep'],
        "telefone": data['telefone']
    }
    coordenador_data = {
        "cod_coordenador": db['coordenadores'].estimated_document_count() + 1,
        "cpf": data['cpf'],
        "salario": data['salario']
    }
    db['pessoas'].insert_one(pessoa_data)
    db['coordenadores'].insert_one(coordenador_data)
    return jsonify({
        'cpf': data['cpf'],
        'cod_coordenador': coordenador_data['cod_coordenador']
    }), 201

@app.route('/coordenadorescursos', methods=['GET'])
def get_coordenadorescursos():
    cursos = list(db['cursos'].aggregate([
        {
            "$lookup": {
                "from": "coordenadores",
                "localField": "cod_coordenador",
                "foreignField": "cod_coordenador",
                "as": "coordenador_info"
            }
        },
        {
            "$unwind": {
                "path": "$coordenador_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$lookup": {
                "from": "pessoas",
                "localField": "coordenador_info.cpf",
                "foreignField": "cpf",
                "as": "pessoa_info"
            }
        },
        {
            "$unwind": {
                "path": "$pessoa_info",
                "preserveNullAndEmptyArrays": True
            }
        },
        {
            "$project": {
                "_id": 0,
                "cod_curso": 1,
                "nome": 1,
                "periodo": 1,
                "credito_total": 1,
                "pessoa_info.nome": 1
            }
        }
    ]))
    return jsonify(cursos)





# Professores
@app.route('/professores', methods=['GET'])
def get_professores():
    professores = list(db['professores'].find({}, {"_id": 0}))
    return jsonify(professores)

@app.route('/professores/<int:cod_professor>', methods=['GET'])
def get_professor(cod_professor):
    professor = db['professores'].find_one({"cod_professor": cod_professor}, {"_id": 0})
    if professor:
        return jsonify(professor)
    return jsonify({'error': 'Professor não encontrado'}), 404

@app.route('/professores', methods=['POST'])
def create_professor():
    data = request.json
    cod_professor = db['professores'].estimated_document_count() + 1
    professor_data = {
        "cod_professor": cod_professor,
        "cpf": data['cpf'],
        "salario": data['salario'],
        "formacao": data.get('formacao')
    }
    db['professores'].insert_one(professor_data)
    return jsonify({'cod_professor': cod_professor}), 201

@app.route('/professores/<int:cod_professor>', methods=['PUT'])
def update_professor(cod_professor):
    data = request.json
    result = db['professores'].update_one(
        {"cod_professor": cod_professor},
        {"$set": {
            "cpf": data['cpf'],
            "salario": data['salario'],
            "formacao": data.get('formacao')
        }}
    )
    if result.matched_count > 0:
        return jsonify({'message': 'Professor atualizado com sucesso'})
    return jsonify({'error': 'Professor não encontrado'}), 404

@app.route('/professores/<int:cod_professor>', methods=['DELETE'])
def delete_professor(cod_professor):
    professor = db['professores'].find_one({"cod_professor": cod_professor})
    if not professor:
        return jsonify({'error': 'Professor não encontrado'}), 404
    
    cpf = professor.get("cpf")
    db['professores'].delete_one({"cod_professor": cod_professor})
    db['pessoas'].delete_one({"cpf": cpf})
    return jsonify({'message': 'Professor deletado com sucesso'})





# Auxiliar Professores
@app.route('/professorespessoas', methods=['GET'])
def get_professorespessoas():
    professores_pessoas = list(db['professores'].aggregate([
        {
            "$lookup": {
                "from": "pessoas",
                "localField": "cpf",
                "foreignField": "cpf",
                "as": "pessoa_info"
            }
        },
        {
            "$unwind": "$pessoa_info"
        },
        {
            "$project": {
                "_id": 0,
                "cod_professor": 1,
                "cpf": 1,
                "nome": "$pessoa_info.nome",
                "email": "$pessoa_info.email",
                "data_nascimento": "$pessoa_info.data_nascimento",
                "sexo": "$pessoa_info.sexo",
                "cep": "$pessoa_info.cep",
                "telefone": "$pessoa_info.telefone",
                "salario": 1,
                "formacao": 1
            }
        }
    ]))
    return jsonify(professores_pessoas)

@app.route('/professorespessoas/<int:cod_professor>', methods=['GET'])
def get_professorpessoa(cod_professor):
    professor_pessoa = db['professores'].aggregate([
        {
            "$match": {"cod_professor": cod_professor}
        },
        {
            "$lookup": {
                "from": "pessoas",
                "localField": "cpf",
                "foreignField": "cpf",
                "as": "pessoa_info"
            }
        },
        {
            "$unwind": "$pessoa_info"
        },
        {
            "$project": {
                "_id": 0,
                "cod_professor": 1,
                "cpf": 1,
                "nome": "$pessoa_info.nome",
                "email": "$pessoa_info.email",
                "data_nascimento": "$pessoa_info.data_nascimento",
                "sexo": "$pessoa_info.sexo",
                "cep": "$pessoa_info.cep",
                "telefone": "$pessoa_info.telefone",
                "salario": 1,
                "formacao": 1
            }
        }
    ])
    professor_pessoa = list(professor_pessoa)
    if professor_pessoa:
        return jsonify(professor_pessoa[0])
    return jsonify({'error': 'Professor não encontrado'}), 404

@app.route('/professorespessoas', methods=['POST'])
def create_professorespessoas():
    data = request.json
    # Inserir na coleção 'pessoas'
    pessoa_data = {
        "cpf": data['cpf'],
        "nome": data['nome'],
        "email": data['email'],
        "data_nascimento": data['data_nascimento'],
        "sexo": data['sexo'],
        "cep": data['cep'],
        "telefone": data['telefone']
    }
    db['pessoas'].insert_one(pessoa_data)
    
    # Inserir na coleção 'professores'
    cod_professor = db['professores'].estimated_document_count() + 1
    professor_data = {
        "cod_professor": cod_professor,
        "cpf": data['cpf'],
        "salario": data['salario'],
        "formacao": data['formacao']
    }
    db['professores'].insert_one(professor_data)
    
    return jsonify({
        'cpf': data['cpf'],
        'cod_professor': cod_professor,
    }), 201

@app.route('/professorespessoas/<int:cod_professor>', methods=['PUT'])
def update_professorpessoa(cod_professor):
    data = request.json
    
    # Atualizar a coleção 'pessoas'
    pessoa_update = {
        "nome": data['nome'],
        "email": data['email'],
        "data_nascimento": data['data_nascimento'],
        "sexo": data['sexo'],
        "cep": data['cep'],
        "telefone": data['telefone']
    }
    db['pessoas'].update_one({"cpf": data['cpf']}, {"$set": pessoa_update})
    
    # Atualizar a coleção 'professores'
    professor_update = {
        "salario": data['salario'],
        "formacao": data['formacao']
    }
    db['professores'].update_one({"cod_professor": cod_professor}, {"$set": professor_update})
    
    return jsonify({'message': 'Professor e Pessoa atualizados com sucesso'})

@app.route('/professorespessoas/<int:cod_professor>', methods=['DELETE'])
def delete_professorpessoa(cod_professor):
    professor = db['professores'].find_one({"cod_professor": cod_professor})
    if not professor:
        return jsonify({'error': 'Professor não encontrado'}), 404

    cpf = professor['cpf']
    db['professores'].delete_one({"cod_professor": cod_professor})
    db['pessoas'].delete_one({"cpf": cpf})

    return jsonify({'message': 'Professor e Pessoa deletados com sucesso'})





# Alunos
@app.route('/alunos', methods=['GET'])
def get_alunos():
    alunos = list(db['alunos'].find({}, {'_id': 0}))  # Ignora o campo '_id' ao retornar
    return jsonify(alunos)

@app.route('/alunos/<string:cod_aluno>', methods=['GET'])
def get_aluno(cod_aluno):
    aluno = db['alunos'].find_one({"cod_aluno": cod_aluno}, {'_id': 0})
    if aluno:
        return jsonify(aluno)
    return jsonify({'error': 'Aluno não encontrado'}), 404

@app.route('/alunos', methods=['POST'])
def create_aluno():
    data = request.json
    cod_aluno = db['alunos'].estimated_document_count() + 1  # Incrementa o código do aluno
    aluno_data = {
        "cod_aluno": cod_aluno,
        "cpf": data['cpf']
    }
    db['alunos'].insert_one(aluno_data)
    return jsonify({'cod_aluno': cod_aluno}), 201

@app.route('/alunos/<string:cod_aluno>', methods=['PUT'])
def update_aluno(cod_aluno):
    data = request.json
    update_result = db['alunos'].update_one(
        {"cod_aluno": cod_aluno},
        {"$set": {"cpf": data['cpf']}}
    )
    if update_result.matched_count == 0:
        return jsonify({'error': 'Aluno não encontrado'}), 404
    return jsonify({'message': 'Aluno atualizado com sucesso'})

@app.route('/alunos/<string:cod_aluno>', methods=['DELETE'])
def delete_aluno(cod_aluno):
    delete_result = db['alunos'].delete_one({"cod_aluno": cod_aluno})
    if delete_result.deleted_count == 0:
        return jsonify({'error': 'Aluno não encontrado'}), 404
    return jsonify({'message': 'Aluno deletado com sucesso'})





#Auxiliar Alunos
@app.route('/alunospessoas', methods=['GET'])
def get_alunospessoas():
    pipeline = [
        {
            "$lookup": {
                "from": "pessoas",
                "localField": "cpf",
                "foreignField": "cpf",
                "as": "pessoa"
            }
        },
        {
            "$unwind": "$pessoa"  # Desestrutura o array para objetos individuais
        },
        {
            "$project": {
                "_id": 0,
                "cod_aluno": 1,
                "cpf": 1,
                "pessoa.nome": 1,
                "pessoa.email": 1,
                "pessoa.data_nascimento": 1,
                "pessoa.sexo": 1,
                "pessoa.cep": 1,
                "pessoa.telefone": 1
            }
        }
    ]
    alunospessoas = list(db['alunos'].aggregate(pipeline))
    return jsonify(alunospessoas)

@app.route('/alunospessoas/<string:cod_aluno>', methods=['GET'])
def get_alunopessoa(cod_aluno):
    pipeline = [
        {"$match": {"cod_aluno": cod_aluno}},
        {
            "$lookup": {
                "from": "pessoas",
                "localField": "cpf",
                "foreignField": "cpf",
                "as": "pessoa"
            }
        },
        {
            "$unwind": "$pessoa"
        },
        {
            "$project": {
                "_id": 0,
                "cod_aluno": 1,
                "cpf": 1,
                "pessoa.nome": 1,
                "pessoa.email": 1,
                "pessoa.data_nascimento": 1,
                "pessoa.sexo": 1,
                "pessoa.cep": 1,
                "pessoa.telefone": 1
            }
        }
    ]
    alunopessoa = list(db['alunos'].aggregate(pipeline))
    if alunopessoa:
        return jsonify(alunopessoa[0])  # Retorna o primeiro (e único) resultado
    return jsonify({'error': 'Aluno não encontrado'}), 404

@app.route('/alunospessoas', methods=['POST'])
def create_alunospessoas():
    data = request.json
    # Inserir dados na coleção "pessoas"
    pessoa_data = {
        "cpf": data['cpf'],
        "nome": data['nome'],
        "email": data['email'],
        "data_nascimento": data['data_nascimento'],
        "sexo": data['sexo'],
        "cep": data['cep'],
        "telefone": data['telefone']
    }
    db['pessoas'].insert_one(pessoa_data)

    # Inserir dados na coleção "alunos"
    cod_aluno = db['alunos'].estimated_document_count() + 1  # Incrementa o código do aluno
    aluno_data = {
        "cod_aluno": cod_aluno,
        "cpf": data['cpf']
    }
    db['alunos'].insert_one(aluno_data)

    return jsonify({
        'cpf': data['cpf'],
        'cod_aluno': cod_aluno
    }), 201





# Cursos
@app.route('/cursos', methods=['GET'])
def get_cursos():
    cursos = list(db['cursos'].find({}, {"_id": 0}))  # Retorna todos os cursos, omitindo o campo "_id"
    return jsonify(cursos)

@app.route('/cursos/<string:cod_curso>', methods=['GET'])
def get_curso(cod_curso):
    curso = db['cursos'].find_one({"cod_curso": cod_curso}, {"_id": 0})
    if curso:
        return jsonify(curso)
    return jsonify({'error': 'Curso não encontrado'}), 404

@app.route('/cursos', methods=['POST'])
def create_curso():
    data = request.json
    # Incrementa o `cod_curso` baseado na contagem de documentos
    cod_curso = db['cursos'].estimated_document_count() + 1
    curso = {
        "cod_curso": cod_curso,
        "nome": data['nome'],
        "periodo": data['periodo'],
        "credito_total": data['credito_total'],
        "cod_coordenador": data['cod_coordenador']
    }
    db['cursos'].insert_one(curso)
    return jsonify({'cod_curso': cod_curso}), 201

@app.route('/cursos/<string:cod_curso>', methods=['PUT'])
def update_curso(cod_curso):
    data = request.json
    update_result = db['cursos'].update_one(
        {"cod_curso": cod_curso},
        {"$set": {
            "nome": data['nome'],
            "periodo": data['periodo'],
            "credito_total": data['credito_total'],
            "cod_coordenador": data['cod_coordenador']
        }}
    )
    if update_result.matched_count == 0:
        return jsonify({'error': 'Curso não encontrado'}), 404
    return jsonify({'message': 'Curso atualizado com sucesso'})

@app.route('/cursos/<string:cod_curso>', methods=['DELETE'])
def delete_curso(cod_curso):
    delete_result = db['cursos'].delete_one({"cod_curso": cod_curso})
    if delete_result.deleted_count == 0:
        return jsonify({'error': 'Curso não encontrado'}), 404
    return jsonify({'message': 'Curso deletado com sucesso'})





# Auxiliar Cursos
@app.route('/cursoscoordenadores/<string:cod_curso>', methods=['GET'])
def get_cursocoordenador(cod_curso):
    curso = db['cursos'].aggregate([
        { "$match": { "cod_curso": cod_curso } },
        { "$lookup": {
            "from": "coordenadores",  # Coleção coordenadores
            "localField": "cod_coordenador",  # Campo que faz a referência
            "foreignField": "cod_coordenador",  # Campo na coleção coordenadores
            "as": "coordenador_info"  # Nome do campo que irá armazenar o resultado da junção
        }},
        { "$unwind": "$coordenador_info" },  # Descompacta a junção para ter acesso aos dados
        { "$lookup": {
            "from": "pessoas",  # Coleção pessoas
            "localField": "coordenador_info.cpf",  # Referência CPF
            "foreignField": "cpf",  # Campo na coleção pessoas
            "as": "coordenador_pessoa"  # Nome do campo para armazenar informações da pessoa
        }},
        { "$unwind": "$coordenador_pessoa" },  # Descompacta para obter dados do coordenador
        { "$project": {
            "cod_curso": 1,
            "nome": 1,
            "periodo": 1,
            "credito_total": 1,
            "coordenador_nome": "$coordenador_pessoa.nome"  # Exibe o nome do coordenador
        }}
    ])
    
    result = list(curso)
    if result:
        return jsonify(result[0])  # Retorna o primeiro resultado
    return jsonify({'error': 'Curso ou coordenador não encontrado'}), 404

@app.route('/cursosdisciplinas/<string:cod_curso>', methods=['GET'])
def get_cursodisciplinas(cod_curso):
    curso_disciplinas = list(db['disciplinas'].find(
        {'cod_curso': cod_curso},  # Filtro: disciplinas do curso
        {'_id': 0}  # Não incluir o campo _id no resultado
    ))

    
    print(list(curso_disciplinas))
    
    result = list(curso_disciplinas)
    if result:
        return jsonify(result)
    return jsonify({'error': 'Disciplinas não encontradas'}), 404





# Disciplinas
@app.route('/disciplinas', methods=['GET'])
def get_disciplinas():
    disciplinas = list(db['disciplinas'].find({}, {"_id": 0}))  # Encontra todas as disciplinas
    return jsonify([disciplina for disciplina in disciplinas])  # Converte o cursor para lista e retorna

@app.route('/disciplinas/<int:cod_disciplina>', methods=['GET'])
def get_disciplina(cod_disciplina):
    disciplina = db['disciplinas'].find_one({"cod_disciplina": cod_disciplina})  # Busca por cod_disciplina
    if disciplina:
        return jsonify(disciplina)
    return jsonify({'error': 'Disciplina não encontrada'}), 404

@app.route('/disciplinas', methods=['POST'])
def create_disciplina():
    data = request.json
    disciplina = {
        "nome": data['nome'],
        "fase": data['fase'],
        "creditos": data['creditos']
    }
    result = db['disciplinas'].insert_one(disciplina)  # Insere a nova disciplina
    return jsonify({'cod_disciplina': result.inserted_id}), 201  # Retorna o ID inserido

@app.route('/disciplinas/<int:cod_disciplina>', methods=['PUT'])
def update_disciplina(cod_disciplina):
    data = request.json
    update_data = {
        "nome": data['nome'],
        "fase": data['fase'],
        "creditos": data['creditos']
    }
    result = db['disciplinas'].update_one(
        {"cod_disciplina": cod_disciplina}, 
        {"$set": update_data}  # Atualiza os campos
    )
    if result.matched_count > 0:
        return jsonify({'message': 'Disciplina atualizada com sucesso'})
    return jsonify({'error': 'Disciplina não encontrada'}), 404

@app.route('/disciplinas/<int:cod_disciplina>', methods=['DELETE'])
def delete_disciplina(cod_disciplina):
    result = db['disciplinas'].delete_one({"cod_disciplina": cod_disciplina})  # Deleta a disciplina
    if result.deleted_count > 0:
        return jsonify({'message': 'Disciplina deletada com sucesso'})
    return jsonify({'error': 'Disciplina não encontrada'}), 404





# Auxiliar Disciplinas
@app.route('/disciplinascursos/<int:cod_curso>', methods=['POST'])
def create_disciplinacurso(cod_curso):
    data = request.json
    # Criando a disciplina
    disciplina = {
        "nome": data['nome'],
        "fase": data['fase'],
        "creditos": data['creditos']
    }
    result = db['disciplinas'].insert_one(disciplina)  # Insere a nova disciplina
    cod_disciplina = result.inserted_id  # ID da disciplina recém-criada
    
    # Relacionando a disciplina ao curso
    curso_disciplina = {
        "cod_curso": cod_curso,
        "cod_disciplina": cod_disciplina
    }
    db['curso_disciplinas'].insert_one(curso_disciplina)  # Insere o relacionamento curso-disciplina
    
    return jsonify({'cod_curso_disciplina': str(cod_disciplina)}), 201  # Retorna o ID da disciplina associada ao curso





# Curso_Disciplinas
@app.route('/curso_disciplinas', methods=['GET'])
def get_curso_disciplinas():
    curso_disciplinas = db['curso_disciplinas'].find()  # Encontrar todas as associações
    resultado = []
    for item in curso_disciplinas:
        resultado.append({
            'cod_curso': item['cod_curso'],
            'cod_disciplina': item['cod_disciplina']
        })
    return jsonify(resultado)

# Criar uma nova associação curso-disciplina
@app.route('/curso_disciplinas', methods=['POST'])
def create_curso_disciplina():
    data = request.json
    curso_disciplina = {
        'cod_curso': data['cod_curso'],
        'cod_disciplina': data['cod_disciplina']
    }
    result = db['curso_disciplinas'].insert_one(curso_disciplina)  # Inserir a associação
    return jsonify({
        'cod_curso': data['cod_curso'],
        'cod_disciplina': data['cod_disciplina']
    }), 201

# Deletar uma associação curso-disciplina
@app.route('/curso_disciplinas', methods=['DELETE'])
def delete_curso_disciplina():
    data = request.json
    result = db['curso_disciplinas'].delete_one({
        'cod_curso': data['cod_curso'],
        'cod_disciplina': data['cod_disciplina']
    })  # Deletar a associação
    
    if result.deleted_count > 0:
        return jsonify({'message': 'Associação curso-disciplina deletada com sucesso'})
    else:
        return jsonify({'error': 'Associação não encontrada'}), 404





# Turmas
@app.route('/turmas', methods=['GET'])
def get_turmas():
    turmas = list(db['turmas'].find({}, {"_id": 0}))  # Encontrar todas as turmas
    # resultado = []
    # for turma in turmas:
    #     resultado.append({
    #         'cod_turma': turma['cod_turma'],
    #         'cod_disciplina': turma['cod_disciplina'],
    #         'horario': turma['horario'],
    #         'ano': turma['ano'],
    #         'semestre': turma['semestre'],
    #         'cod_professor': turma['cod_professor']
    #     })
    return jsonify(turmas)

# Obter uma turma específica
@app.route('/turmas/<int:cod_turma>', methods=['GET'])
def get_turma(cod_turma):
    turma = db['turmas'].find_one({'cod_turma': cod_turma})  # Encontrar turma pelo cod_turma
    if turma:
        return jsonify({
            'cod_turma': turma['cod_turma'],
            'cod_disciplina': turma['cod_disciplina'],
            'horario': turma['horario'],
            'ano': turma['ano'],
            'semestre': turma['semestre'],
            'cod_professor': turma['cod_professor']
        })
    return jsonify({'error': 'Turma não encontrada'}), 404

# Criar uma nova turma
@app.route('/turmas', methods=['POST'])
def create_turma():
    data = request.json
    turma = {
        'cod_disciplina': data['cod_disciplina'],
        'horario': data['horario'],
        'ano': data['ano'],
        'semestre': data['semestre'],
        'cod_professor': data['cod_professor']
    }
    result = db['turmas'].insert_one(turma)  # Inserir a turma
    return jsonify({
        'cod_turma': result.inserted_id,
        'cod_disciplina': data['cod_disciplina'],
        'horario': data['horario'],
        'ano': data['ano'],
        'semestre': data['semestre'],
        'cod_professor': data['cod_professor']
    }), 201

# Atualizar uma turma existente
@app.route('/turmas/<int:cod_turma>', methods=['PUT'])
def update_turma(cod_turma):
    data = request.json
    result = db['turmas'].update_one(
        {'cod_turma': cod_turma},
        {'$set': {
            'cod_disciplina': data['cod_disciplina'],
            'horario': data['horario'],
            'ano': data['ano'],
            'semestre': data['semestre'],
            'cod_professor': data['cod_professor']
        }}
    )  # Atualizar a turma

    if result.matched_count > 0:
        return jsonify({'message': 'Turma atualizada com sucesso'})
    else:
        return jsonify({'error': 'Turma não encontrada'}), 404

# Deletar uma turma
@app.route('/turmas/<int:cod_turma>', methods=['DELETE'])
def delete_turma(cod_turma):
    result = db['turmas'].delete_one({'cod_turma': cod_turma})  # Deletar a turma
    if result.deleted_count > 0:
        return jsonify({'message': 'Turma deletada com sucesso'})
    else:
        return jsonify({'error': 'Turma não encontrada'}), 404






# Relatorios
@app.route('/relatorios', methods=['GET'])
def get_relatorios():
    relatorios = db['relatorios'].aggregate([
        {
            '$lookup': {
                'from': 'alunos',
                'localField': 'cod_aluno',
                'foreignField': 'cod_aluno',
                'as': 'aluno'
            }
        },
        {
            '$lookup': {
                'from': 'historicos',
                'localField': 'cod_aluno',
                'foreignField': 'cod_aluno',
                'as': 'historico'
            }
        },
        {
            '$lookup': {
                'from': 'disciplinas',
                'localField': 'cod_disciplina',
                'foreignField': 'cod_disciplina',
                'as': 'disciplinas'
            }
        },
        {
            '$group': {
                '_id': '$cod_relatorio',
                'cod_relatorio': {'$first': '$cod_relatorio'},
                'cod_aluno': {'$first': '$cod_aluno'},
                'disciplinas': {'$push': '$disciplinas.nome'},
                'notas': {'$first': '$notas'},
                'faltas': {'$first': '$faltas'}
            }
        }
    ])
    result = list(relatorios)
    return jsonify(result)

# Obter histórico de um aluno específico
@app.route('/historico/<int:cod_aluno>', methods=['GET'])
def get_historico_aluno(cod_aluno):
    historico = db['historicos'].aggregate([
        {
            '$lookup': {
                'from': 'disciplinas',
                'localField': 'cod_disciplina',
                'foreignField': 'cod_disciplina',
                'as': 'disciplina'
            }
        },
        {
            '$match': {
                'cod_aluno': cod_aluno
            }
        },
        {
            '$project': {
                'nome': {'$arrayElemAt': ['$disciplina.nome', 0]},
                'nota_geral': 1,
                'frequencia_geral': 1,
                'aprovacao_final': 1
            }
        }
    ])
    result = list(historico)
    return jsonify(result)

# Obter histórico escolar completo de um aluno
@app.route('/historicoescolar/<int:cod_aluno>', methods=['GET'])
def get_historicoescolar(cod_aluno):
    historico_escolar = db['historicos'].aggregate([
        {
            '$lookup': {
                'from': 'disciplinas',
                'localField': 'cod_disciplina',
                'foreignField': 'cod_disciplina',
                'as': 'disciplinas'
            }
        },
        {
            '$lookup': {
                'from': 'relatorios',
                'localField': 'cod_turma',
                'foreignField': 'cod_turma',
                'as': 'relatorios'
            }
        },
        {
            '$match': {
                'cod_aluno': cod_aluno
            }
        },
        {
            '$unwind': '$disciplinas'
        },
        {
            '$project': {
                'cod_disciplina': '$disciplinas.cod_disciplina',
                'nome': '$disciplinas.nome',
                'fase': '$disciplinas.fase',
                'creditos': '$disciplinas.creditos',
                'notas': 1,
                'faltas': 1,
                'nota_geral': 1,
                'frequencia_geral': 1,
                'aprovacao_final': 1
            }
        },
        {
            '$sort': {
                'cod_disciplina': 1
            }
        }
    ])
    result = list(historico_escolar)
    return jsonify(result)

# Obter conclusão escolar de um aluno
@app.route('/conclusaoescolar/<int:cod_aluno>', methods=['GET'])
def get_conclusaoescolar(cod_aluno):
    conclusao_escolar = db['relatorios'].aggregate([
        {
            '$match': {
                'cod_aluno': cod_aluno
            }
        },
        {
            '$group': {
                '_id': '$cod_aluno',
                'total_creditos': {'$sum': '$creditos'},
                'creditos_concluidos': {'$sum': {'$cond': [{'$eq': ['$aprovacao_final', True]}, '$creditos', 0]}}
            }
        },
        {
            '$project': {
                'percentual_conclusao': {
                    '$multiply': [
                        {'$divide': ['$creditos_concluidos', '$total_creditos']},
                        100
                    ]
                }
            }
        }
    ])
    result = list(conclusao_escolar)
    return jsonify(result)

# Obter um relatório específico
@app.route('/relatorios/<int:cod_relatorio>', methods=['GET'])
def get_relatorio(cod_relatorio):
    relatorio = db['relatorios'].find_one({'cod_relatorio': cod_relatorio})
    if relatorio:
        return jsonify(relatorio)
    return jsonify({'error': 'Relatório não encontrado'}), 404

# Criar um novo relatório
@app.route('/relatorios', methods=['POST'])
def create_relatorio():
    data = request.json
    relatorio = {
        'cod_aluno': data['cod_aluno'],
        'cod_turma': data['cod_turma'],
        'conteudo': data['conteudo'],
        'data_envio': data['data_envio'],
        'notas': data.get('notas', None),
        'faltas': data.get('faltas', None)
    }
    result = db['relatorios'].insert_one(relatorio)
    return jsonify({'cod_relatorio': result.inserted_id}), 201

# Atualizar um relatório existente
@app.route('/relatorios/<int:cod_relatorio>', methods=['PUT'])
def update_relatorio(cod_relatorio):
    data = request.json
    update_data = {
        'cod_aluno': data['cod_aluno'],
        'cod_turma': data['cod_turma'],
        'conteudo': data['conteudo'],
        'data_envio': data['data_envio'],
        'notas': data.get('notas', None),
        'faltas': data.get('faltas', None)
    }
    result = db['relatorios'].update_one({'cod_relatorio': cod_relatorio}, {'$set': update_data})
    if result.matched_count > 0:
        return jsonify({'message': 'Relatório atualizado com sucesso'})
    return jsonify({'error': 'Relatório não encontrado'}), 404

# Deletar um relatório
@app.route('/relatorios/<int:cod_relatorio>', methods=['DELETE'])
def delete_relatorio(cod_relatorio):
    result = db['relatorios'].delete_one({'cod_relatorio': cod_relatorio})
    if result.deleted_count > 0:
        return jsonify({'message': 'Relatório deletado com sucesso'})
    return jsonify({'error': 'Relatório não encontrado'}), 404






# Historicos
@app.route('/historicos', methods=['GET'])
def get_historicos():
    historicos = db['historicos'].find()
    result = list(historicos)
    return jsonify(result)

# Obter um histórico específico
@app.route('/historicos/<int:cod_historico>', methods=['GET'])
def get_historico(cod_historico):
    historico = db['historicos'].find_one({'cod_historico': cod_historico})
    if historico:
        return jsonify(historico)
    return jsonify({'error': 'Histórico não encontrado'}), 404

# Criar um novo histórico
@app.route('/historicos', methods=['POST'])
def create_historico():
    data = request.json
    historico = {
        'cod_aluno': data['cod_aluno'],
        'cod_turma': data['cod_turma'],
        'nota': data['nota'],
        'frequencia': data['frequencia'],
        'status': data['status']
    }
    result = db['historicos'].insert_one(historico)
    return jsonify({'cod_historico': result.inserted_id}), 201

# Atualizar um histórico existente
@app.route('/historicos/<int:cod_historico>', methods=['PUT'])
def update_historico(cod_historico):
    data = request.json
    update_data = {
        'cod_aluno': data['cod_aluno'],
        'cod_turma': data['cod_turma'],
        'nota': data['nota'],
        'frequencia': data['frequencia'],
        'status': data['status']
    }
    result = db['historicos'].update_one({'cod_historico': cod_historico}, {'$set': update_data})
    if result.matched_count > 0:
        return jsonify({'message': 'Histórico atualizado com sucesso'})
    return jsonify({'error': 'Histórico não encontrado'}), 404

# Deletar um histórico
@app.route('/historicos/<int:cod_historico>', methods=['DELETE'])
def delete_historico(cod_historico):
    result = db['historicos'].delete_one({'cod_historico': cod_historico})
    if result.deleted_count > 0:
        return jsonify({'message': 'Histórico deletado com sucesso'})
    return jsonify({'error': 'Histórico não encontrado'}), 404





#intercessão
# Alunos e Disciplinas
@app.route('/alunos_disciplinas', methods=['GET'])
def get_alunos_disciplinas():
    alunos_disciplinas = []
    
    # Buscar todos os alunos
    alunos = db['alunos'].find()
    for aluno in alunos:
        # Buscar informações de pessoa
        pessoa = db['pessoas'].find_one({'cpf': aluno['cpf']})
        
        # Buscar históricos e disciplinas associadas
        historicos = db['historicos'].find({'cod_aluno': aluno['cod_aluno']})
        for historico in historicos:
            disciplina = db['disciplinas'].find_one({'cod_disciplina': historico['cod_disciplina']})
            alunos_disciplinas.append({
                'cod_aluno': aluno['cod_aluno'],
                'aluno_nome': pessoa['nome'],
                'disciplina_nome': disciplina['nome']
            })
    
    return jsonify(alunos_disciplinas)

# Coordenadores e Cursos
@app.route('/coordenadores_cursos', methods=['GET'])
def get_coordenadores_cursos():
    coordenadores_cursos = []
    
    # Buscar todos os coordenadores
    coordenadores = db['coordenadores'].find()
    for coordenador in coordenadores:
        # Buscar informações de pessoa
        pessoa = db['pessoas'].find_one({'cpf': coordenador['cpf']})
        
        # Buscar cursos associados ao coordenador
        curso = db['cursos'].find_one({'cod_coordenador': coordenador['cod_coordenador']})
        coordenadores_cursos.append({
            'cod_coordenador': coordenador['cod_coordenador'],
            'coordenador_nome': pessoa['nome'],
            'curso_nome': curso['nome']
        })
    
    return jsonify(coordenadores_cursos)

# Professores e Disciplinas
@app.route('/professores_disciplinas', methods=['GET'])
def get_professores_disciplinas():
    professores_disciplinas = []
    
    # Buscar todos os professores
    professores = db['professores'].find()
    for professor in professores:
        # Buscar informações de pessoa
        pessoa = db['pessoas'].find_one({'cpf': professor['cpf']})
        
        # Buscar turmas e disciplinas associadas
        turmas = db['turmas'].find({'cod_professor': professor['cod_professor']})
        for turma in turmas:
            disciplina = db['disciplinas'].find_one({'cod_disciplina': turma['cod_disciplina']})
            professores_disciplinas.append({
                'cod_professor': professor['cod_professor'],
                'professor_nome': pessoa['nome'],
                'disciplina_nome': disciplina['nome']
            })
    
    return jsonify(professores_disciplinas)



if __name__ == '__main__':
	app.run(debug=True, host='0.0.0.0', port=5002)