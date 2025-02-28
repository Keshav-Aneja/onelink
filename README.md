# Onelink [in development]

<b><p>One stop solution for storing all your goto links.</p></b>

## Problem

<p>While searching through web I find many useful materials, this can include some good blogs, documentations, articles, research papers, etc.</p>
<p>But Bookmarking them on the browser isn't the best way. As we all know we tend to forget about those bookmarks and the resources which we think we will follow up or read them later. We all can agree they are lost in the blackhole of bookmarks</p>

<br/>
<p>This is a pretty simple application where you will be able to store your links in different directories and thus maintain them as per your need.</p>

## Why I made this?

<p>To be honest :D I was inactive with writing code for some time, so to get back on track, and trying to improve my coding practices. I choose this idea. I was struggling to find a solution for this problem myself, so I thought why not create this on my own.</p>

## Technologies Used (Pretty Basic tbh)

<ul>
    <li> React 19</li>
    <li> Express</li>
    <li> Typescript</li>
    <li> TailwindCSS@4 </li>
    <li> Postgresql</li>
    <li> Knex.js</li>
    <li> Redis</li>
    <li> OAuth2.0 </li>
</ul>

## Apps & Packages

<p><code>web</code> : a Vite-React App (Frontend)</p>
<p><code>backend</code> :Express.js server Backend</p>
<p><code>@onelink/typescript-config</code> : <code>tsconfig.json</code> used throughout the monorepo</p>
<p><code>@onelink/eslint-config</code> : <code>eslint</code>configurations</p>
<p><code>@onelink/db</code> : For all Database configurations, migrations, schema</p>
<p><code>@onelink/entities</code> : Contains the types, interfaces, Schemas and error types

## Todo

<ul style="list-style-type:none">
    <li style="color:green"><b>[&nbsp;O&nbsp;]</b> Turbo repo setup</li>
    <li style="color:green"><b>[&nbsp;O&nbsp;]</b> Configure tsconfig package</li>
    <li style="color:green"><b>[&nbsp;O&nbsp;]</b> Data Modelling</li>
    <li style="color:green"><b>[&nbsp;O&nbsp;]</b> Setup Knex.js & PostgreSQL</li>
    <li style="color:green"><b>[&nbsp;O&nbsp;]</b> Create basic user types</li>
    <li style="color:green"><b>[&nbsp;O&nbsp;]</b> Authentication session service</li>
    <li style="color:green"><b>[&nbsp;O&nbsp;]</b> User Repository</li>
    <li style="color:green"><b>[&nbsp;O&nbsp;]</b> Implement Google Authentication</li>
    <li style="color:red"><b>[&nbsp;X&nbsp;]</b> Refactor AuthService</li>
</ul>
