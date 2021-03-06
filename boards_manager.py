import db


@db.use
def get_statuses(cursor):
    query = """
        SELECT *
        FROM statuses ORDER BY id;
    """
    cursor.execute(query)
    return cursor.fetchall()


@db.use
def get_boards(cursor):
    query = """
        SELECT *
        FROM boards ORDER BY id DESC;
    """
    cursor.execute(query)
    return cursor.fetchall()


@db.use
def get_cards(cursor, board_id):
    query = """
        SELECT cards.title as card_title, 
                cards.id as card_id, 
                statuses.title as status_name,
                cards.rank, 
                cards.status_id,
                cards.board_id
        FROM cards JOIN statuses ON cards.status_id = statuses.id
        WHERE cards.board_id = %(board_id)s
        ;
    """
    cursor.execute(query, {
        'board_id': board_id
    })
    return cursor.fetchall()


@db.use
def update_board(cursor, data):
    query = """
        UPDATE boards SET title = %(title)s WHERE id = %(id)s;
    """
    return cursor.execute(query, {
        'id': data['id'],
        'title': data['title']
    })


@db.use
def update_status(cursor, data):
    query = """
        UPDATE statuses SET title = %(title)s WHERE id = %(id)s; 
    """
    return cursor.execute(query, {
        'id': data['id'],
        'title': data['title']
    })


@db.use
def create_board(cursor, title):
    query = """
        INSERT INTO boards (title) VALUES (%(title)s);
    """
    return cursor.execute(query, {
        'title': title
    })


@db.use
def insert_status(cursor, title, board_id):
    query = """
        INSERT INTO statuses (title, board_id) VALUES (%(title)s, %(board_id)s);
    """
    return cursor.execute(query, {
        'title': title,
        'board_id': board_id
    })


@db.use
def create_card(cursor, data):
    query = """
        INSERT INTO cards (board_id, title, status_id, rank) 
            VALUES (%(board_id)s,%(title)s, %(status_id)s, %(rank)s);
    """
    return cursor.execute(query, {
        'board_id': data['board_id'],
        'title': data['title'],
        'status_id': data['status_id'],
        'rank': 0
    })


@db.use
def update_card(cursor, data):
    query = """
        UPDATE cards SET title = %(title)s WHERE id = %(id)s;
    """
    return cursor.execute(query, {
        'id': data['card_id'],
        'title': data['title']
    })


@db.use
def delete_board(cursor, board_id):
    query = """
        DELETE FROM boards WHERE id = %(board_id)s
    """
    # delete cards
    return cursor.execute(query, {'board_id': board_id})


@db.use
def get_board_id(cursor, title):
    query = """
            SELECT id FROM boards WHERE title = %(title)s;
    """
    cursor.execute(query, {
        'title': title
    })
    return cursor.fetchone()
