<p align="center">
  <a href="https://github.com/risenforces/nestjs-zod-prisma">
    <img src="/logo.svg" alt="NestJS Zod Prisma" width="120" height="120">
  </a>
  <h1></h1>
  <p align="center">
    ✨ The fork of Zod Prisma generator for using with nestjs-zod ✨
  </p>
</p>
<br/>
<p align="center">
  <a href="https://github.com/risenforces/nestjs-zod-prisma/actions?query=branch%3Amain">
    <img src="https://github.com/risenforces/nestjs-zod-prisma/actions/workflows/test-and-build.yml/badge.svg?event=push&branch=main" alt="nestjs-zod CI Status" />
  </a>
  <a href="https://opensource.org/licenses/MIT" rel="nofollow">
    <img src="https://img.shields.io/github/license/risenforces/nestjs-zod-prisma" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/nestjs-zod-prisma" rel="nofollow">
    <img src="https://img.shields.io/npm/dw/nestjs-zod-prisma.svg" alt="npm">
  </a>
  <a href="https://www.npmjs.com/package/nestjs-zod-prisma" rel="nofollow">
    <img src="https://img.shields.io/github/stars/risenforces/nestjs-zod-prisma" alt="stars">
  </a>
</p>

## Ecosystem

| Package | About |
| :-- | :-- |
| [nestjs-zod](https://github.com/risenforces/nestjs-zod) | A tools for integrating Zod into your NestJS application |
| [nestjs-zod-prisma](https://github.com/risenforces/nestjs-zod-prisma) | Generate Zod schemas from your Prisma schema |

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary><h2 style="display: inline-block">Table of Contents</h2></summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a>
      <ul>
      <li><a href="#jsdoc-generation">JSDoc Generation</a></li>
      <li><a href="#extending-zod-fields">Extending Zod Fields</a></li>
      <li>
        <a href="#importing-helpers">Importing Helpers</a>
        <ul>
        <li><a href="#custom-zod-schema">Custom Zod Schemas</a></li>
        </ul>
      </li>
      <li><a href="#json-fields">JSON Fields</a></li>
      </ul>
    </li>
    <li><a href="#examples">Examples</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

## About The Project

Zod Prisma doesn't work well with `nestjs-zod` and its author has been inactive for a long time - so I created this fork to fix the problems that I suffered from.

To work better with `nestjs-zod`, this library provides a little different API for Prisma rich comments directives.

You can use `@z.string().etc()` for specifying different `nestjs-zod/z` schemas, `@z&.something().etc()` for applying a new methods on the schema and `@z.from(imports.MyPasswordSchema)` for using your own schemas.

Also, this library generates DTOs for better NestJS integration. It's done using `createZodDto` from `nestjs-zod`.

And we still support the JSDoc comments.

### Built With

-   [dts-cli](https://github.com/weiran-zsd/dts-cli)
-   [Zod](https://github.com/colinhacks/zod)
-   [Based on this gist](https://gist.github.com/deckchairlabs/8a11c33311c01273deec7e739417dbc9)

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- `prisma` - `^3.0.0`
- `nestjs-zod` - `^0.4.4`

### Installation

0.  **Ensure your tsconfig.json enables the compiler's strict mode.**
    **Zod requires it and so do we, you will experience TS errors without strict mode enabled**

1.  Add nestjs-zod-prisma as a dev dependency

    ```sh
    yarn add -D nestjs-zod-prisma
    ```

2.  Add the nestjs-zod-prisma generator to your schema.prisma

    ```prisma
    generator zod {
      provider                 = "nestjs-zod-prisma"
      output                   = "./src/zod" // (default) the directory where generated zod schemas will be saved

      relationModel            = true // (default) Create and export both plain and related models.
      // relationModel         = "default" // Do not export model without relations.
      // relationModel         = false // Do not generate related model

      generateDto              = true // (default) Generate DTOs for NestJS

      modelCase                = "PascalCase" // (default) Output models using pascal case (ex. UserModel, PostModel)
      // modelCase             = "camelCase" // Output models using camel case (ex. userModel, postModel)

      modelSuffix              = "Model" // (default) Suffix to apply to your prisma models when naming Zod schemas

      dtoCase                = "PascalCase" // (default) Output DTOs using pascal case (ex. UserDto, PostDto)
      // dtoCase             = "camelCase" // Output DTOs using camel case (ex. userDto, postDto)

      dtoSuffix              = "Dto" // (default) Suffix to apply to your prisma models when naming DTOs

      // useDecimalJs          = false // (default) represent the prisma Decimal type using as a JS number
      useDecimalJs             = true // represent the prisma Decimal type using Decimal.js (as Prisma does)

      imports                  = null // (default) will import the referenced file in generated schemas to be used via imports.someExportedVariable

      // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-by-null-values
      prismaJsonNullability    = true // (default) uses prisma's scheme for JSON field nullability
      // prismaJsonNullability = false // allows null assignment to optional JSON fields
    }
    ```

3.  Run `npx prisma generate` or `yarn prisma generate` to generate your zod schemas
4.  Import the generated schemas form your selected output location

<!-- USAGE EXAMPLES -->

## Usage

### JSDoc Generation

[Rich-comments](https://www.prisma.io/docs/concepts/components/prisma-schema#comments)
in the Prisma schema will be transformed into JSDoc for the associated fields:

> _Note: make sure to use a triple-slash. Double-slash comments won't be processed._

```prisma
model Post {
  /// The unique identifier for the post
  /// @default {Generated by database}
  id String @id @default(uuid())

  /// A brief title that describes the contents of the post
  title String

  /// The actual contents of the post.
  contents String
}
```

Generated code:

```ts
export const PostModel = z.object({
  /**
   * The unique identifier for the post
   * @default {Generated by database}
   */
  id: z.string().uuid(),
  /**
   * A brief title that describes the contents of the post
   */
  title: z.string(),
  /**
   * The actual contents of the post.
   */
  contents: z.string(),
})
```

### Using different Zod type

You can also use the `@z` keyword in rich-comments in the Prisma schema
to specify your Zod schema:

```prisma
model User {
  id String @id @default(uuid()) /// @z.string().uuid()

  /// @z.string().min(8).max(20)
  username String

  /// @z.password().atLeastOne('digit').atLeastOne('lowercase').atLeastOne('uppercase').min(8).max(100)
  password String
}
```

Generated code:

```ts
export const UserModel = z.object({
  id: z.string().uuid(),
  username: z.string().min(8).max(20),
  password: z
    .password()
    .atLeastOne('digit')
    .atLeastOne('lowercase')
    .atLeastOne('uppercase')
    .min(8)
    .max(100),
})
```

### Importing Helpers

Sometimes its useful to define a custom Zod preprocessor or transformer for your data.
nestjs-zod-prisma enables you to reuse these by importing them via a config options. For example:

```prisma
generator zod {
  provider      = "nestjs-zod-prisma"
  output        = "./src/zod"
  imports       = "../zod-schemas"
}

model User {
  username  String /// @z.string().refine(imports.isValidUsername)
}
```

The referenced file can then be used by simply referring to exported members via `imports.whateverExport`.
The generated zod schema files will now include a namespaced import like the following.

```typescript
import * as imports from '../../src/zod-schemas'
```

### Using custom Zod schema

Use combination of `z.from` and `imports` to apply your custom Zod schema:

```prisma
model User {
  id String @id @default(uuid())
  username String

  /// @z.from(imports.MyPasswordSchema)
  password String
}
```

### JSON Fields

JSON fields in Prisma disallow null values. This is to disambiguate between setting a field's value to NULL in the database and having
a value of null stored in the JSON. In accordance with this nestjs-zod-prisma will default to disallowing null values, even if your JSON field is optional.

If you would like to revert this behavior and allow null assignment to JSON fields,
you can set `prismaJsonNullability` to `false` in the generator options.

## Examples

<!-- Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources. -->

_For examples, please refer to the [Examples Directory](https://github.com/risenforces/nestjs-zod-prisma/blob/main/examples) or the [Functional Tests](https://github.com/risenforces/nestjs-zod-prisma/blob/main/src/test/functional)_

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/risenforces/nestjs-zod-prisma/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Evgeny Zakharov - risenforces@gmail.com

Project Link: [https://github.com/risenforces/nestjs-zod-prisma](https://github.com/risenforces/nestjs-zod-prisma)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[npm-shield]: https://img.shields.io/npm/v/nestjs-zod-prisma?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/nestjs-zod-prisma
[contributors-shield]: https://img.shields.io/github/contributors/risenforces/nestjs-zod-prisma.svg?style=for-the-badge
[contributors-url]: https://github.com/risenforces/nestjs-zod-prisma/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/risenforces/nestjs-zod-prisma.svg?style=for-the-badge
[forks-url]: https://github.com/risenforces/nestjs-zod-prisma/network/members
[stars-shield]: https://img.shields.io/github/stars/risenforces/nestjs-zod-prisma.svg?style=for-the-badge
[stars-url]: https://github.com/risenforces/nestjs-zod-prisma/stargazers
[issues-shield]: https://img.shields.io/github/issues/risenforces/nestjs-zod-prisma.svg?style=for-the-badge
[issues-url]: https://github.com/risenforces/nestjs-zod-prisma/issues
[license-shield]: https://img.shields.io/github/license/risenforces/nestjs-zod-prisma.svg?style=for-the-badge
[license-url]: https://github.com/risenforces/nestjs-zod-prisma/blob/main/LICENSE
