DROP TABLE IF EXISTS boards;
DROP TABLE IF EXISTS cards;
DROP TABLE IF EXISTS statuses;



CREATE TABLE boards (
    id   SERIAL PRIMARY KEY NOT NULL,
    title VARCHAR(200) NOT NULL
);


CREATE TABLE cards (
    id            SERIAL PRIMARY KEY NOT NULL,
    board_id      INTEGER NOT NULL,
    title         VARCHAR(200) NOT NULL,
    status_id     INTEGER NOT NULL,
    rank          INTEGER NOT NULL
);


CREATE TABLE statuses (
    id        SERIAL PRIMARY KEY NOT NULL,
    title      VARCHAR(200) NOT NULL
);


ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_board_id FOREIGN KEY (board_id) REFERENCES boards(id);


ALTER TABLE ONLY cards
    ADD CONSTRAINT fk_cards_status_id FOREIGN KEY (status_id) REFERENCES statuses(id);
