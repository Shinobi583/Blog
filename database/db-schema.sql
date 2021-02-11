USE blog;

/* Figure out how to implement password hashes and OAuth */
CREATE TABLE users
(
    id INT AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    intro TINYTEXT,
    user_profile TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login DATETIME,
    PRIMARY KEY(id)
);

CREATE TABLE posts
(
    id BIGINT AUTO_INCREMENT,
    title VARCHAR(100) NOT NULL,
    meta_title VARCHAR(125),
    slug VARCHAR(125) UNIQUE,
    details TINYTEXT,
    content LONGTEXT,
    users_id INT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    published_at DATETIME,
    FOREIGN KEY(users_id) REFERENCES users(id) ON DELETE CASCADE,
    PRIMARY KEY(id)
);

CREATE TABLE paragraphs
(
    content LONGTEXT NOT NULL,
    place INT NOT NULL,
    posts_id BIGINT NOT NULL,
    FOREIGN KEY(posts_id) REFERENCES posts(id) ON DELETE CASCADE,
    PRIMARY KEY(place, posts_id)
);

/* Showing most recent post in the group */
SELECT * FROM
(SELECT DISTINCT title, topics_id, created_at
FROM posts
ORDER BY posts.topics_id,
         posts.created_at DESC) AS recent
GROUP BY topics_id;

/* Username for login but full name only displayed */
INSERT INTO users(email, username, password_hash, first_name, last_name)
VALUES("Shinobi583@gmail.com", "Shinobi", "fakefornow", "Chace", "DeLoach");

INSERT INTO posts(title, slug, details, content, users_id)
VALUES("Async and Await", "async-and-await", "These are the details", "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores esse tenetur id, eius illo doloribus rerum dicta reprehenderit quod consequatur laudantium delectus repellat odit? Reprehenderit soluta nostrum et. Magni, a.
Quae alias tempore voluptatibus corrupti mollitia, ex eaque eum, quidem autem quasi at doloremque? Quos autem necessitatibus dignissimos sint pariatur inventore velit? Aliquam quae facere mollitia libero velit, architecto esse?
Soluta iusto aperiam reiciendis vero ratione et facere voluptatem repellat eveniet expedita nobis beatae recusandae libero dolorem, architecto accusantium rem tempora dignissimos maxime obcaecati! Qui cupiditate minus veritatis! Qui, molestiae.
Omnis laudantium non magnam unde veniam, earum illo tempore molestiae vel fugiat. Porro consectetur sapiente eaque! Veniam consectetur natus est soluta, corrupti incidunt voluptatem necessitatibus, tempore, nemo asperiores sint odit?
Asperiores ullam qui odit aliquam beatae nostrum, possimus reprehenderit saepe omnis error deleniti nihil ipsa tempore consequatur eos numquam soluta illum. Aperiam ipsa animi iusto temporibus repellat eos perspiciatis perferendis!
Maiores aliquid incidunt dolore provident. Autem, nulla fuga. Architecto, pariatur, molestias sapiente voluptatum error, dolor doloribus corporis commodi libero asperiores quasi magni at adipisci dolorum similique! Incidunt quia veritatis soluta.
Quasi perferendis quis, harum quas praesentium libero, consequatur, tenetur numquam ratione facere aut blanditiis ipsum expedita molestiae eligendi reiciendis porro asperiores mollitia voluptates nihil dolorem deleniti distinctio sapiente. Distinctio, provident.
Repellendus, consequatur commodi cessitatibus aut praesentium quas libero sapiente facilis ullam.


Accusantium, praesentium temporibus! Voluptas, voluptatum debitis. Hic eius sequi aperiam magni tenetur quo nisi veniam at, ut eligendi natus quam temporibus quos quod, ratione totam sunt labore reiciendis molestias cupiditate!
Accusamus maiores ipsum officiis, expedita optio dicta autem deserunt minus. At esse, numquam aliquid nemo laboriosam consequuntur facilis corrupti facere ad nobis sint architecto quisquam accusamus vel? Molestiae, laboriosam facere.
Reprehenderit sunt quasi delectus corporis quam iste illo, exercitationem nihil suscipit culpa, quis eaque ea sequi doloribus atque dicta earum dolorum libero sapiente ex tempora repudiandae aut voluptatibus! Nesciunt, placeat?
Qui atque repudiandae consectetur nemo dolor, libero enim dolorum voluptatem recusandae, debitis provident? Ab suscipit, aliquam nihil non aut doloribus expedita repellendus eos, perspiciatis rerum commodi tempora excepturi incidunt ea?
Labore quibusdam itaque possimus magnam incidunt commodi aperiam voluptatem debitis! Aliquid culpa voluptate distinctio maiores laboriosam officiis, eius accusamus, omnis neque praesentium iure dolorum harum debitis sequi, sed expedita? Rerum.
Eveniet tenetur, minima esse eius vitae hic a tempore incidunt facere ratione maiores voluptatem distinctio cupiditate consequuntur doloremque explicabo, dolorem ipsa repudiandae! At numquam voluptatum nostrum consectetur maxime obcaecati. Consecteturs!
Porro, tenetur nobis hic quas eveniet provident a dicta aliquam veritatis totam culpa odit velit neque earum delectus voluptate, temporibus accusamus cumque doloribus accusantium consectetur fugiat doloremque corrupti. Saepe, animi.
Inventore placeat aliquam debitis fugiat at culpa quidem est assumenda dicta facere obcaecati exercitationem atque, repudiandae porro excepturi sapiente dolore provident impedit eaque mollitia illo, consectetur explicabo! Consequuntur, ad totam!
Ullam eaque enim dolorem, tempore quidem rerum molestias quo sit fugit quod quisquam quas totam rem ex nemo alias cum aperiam. Sed cum laboriosam eveniet animi, deleniti alias impedit ipsa!
Blanditiis, rem temporibus. Error magni, sit rem velit quos maxime minus repudiandae quaerat repellat maiores dolorum quae numquam autem, tempora blanditiis a. Sunt saepe voluptatem culpa soluta modi natus veritatis!
Error, ea. Dolor amet eveniet doloribus dicta corrupti quos quae repellat harum dolorem nihil, nobis velit a quaerat rerum, explicabo voluptatum sed laboriosam? Illum ex maiores praesentium quas laborum earum!
Deserunt vero nam, provident commodi quis ea amet fuga animi autem facilis molestiae, id nulla iste rerum dolores vel, dignissimos mollitia quidem illum modi ratione! Sapiente aperiam inventore at quia.
Inventore, itaque quasi quod voluptas consequuntur dolor nostrum numquam voluptates officiis alias. Deserunt facere, qui laudantium quaerat autem debitis consequatur blanditiis doloribus fugiat omnis nesciunt recusandae quo numquam tenetur alias?
Non cupiditate animi accusantium qui maxime dolorum totam placeat amet quia beatae sint dolorem reiciendis quibusdam laudantium laboriosam itaque fugit, aperiam quod repudiandae culpa commodi? Cupiditate dolores aspernatur minima mollitia?
Vel esse blanditiis eius ea nulla reiciendis molestiae fugiat. Molestiae nesciunt et quaerat recusandae iure eius incidunt vero, ratione minus ad! Quaerat totam distinctio quas perferendis necessitatibus doloribus accusamus nostrum.",
1);