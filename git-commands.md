# Git commands cheat sheet

Here are some git commands as a cheat sheet for development purposes.

Before you start, make sure you have set up a remote git repository on GitHub
and have a local repository initialized in your project that is connected
to the remote GitHub repository.

Running the following command will help you confirm that you have set this up
correctly.

```bash
git remote get-url origin
```

Make sure you are starting from the `main` branch and have committed all your
code before this in the `main` branch.

Running `git branch` should show the following output:

```plaintext
* main
```

Running the following command should show no files to be committed:

```bash
git status
```

Now, create a branch off of the `main` branch for development called `dev`.
This branch will hold all the changes that are not yet in production.

```bash
git checkout -b dev
```

Push the created `dev` branch to the GitHub remote repository.

```bash
git push origin dev
```

Then checkout a feature branch called `auth-setup` from the `dev` branch.

```bash
git checkout -b auth-setup
```

Once you thoroughly test that your `auth-setup` feature branch is working,
merge the branch into the `dev` branch.

To do this, first checkout the `dev` branch:

```bash
git checkout dev
```

Then, make sure you have the latest changes in the development branch from
your remote repository in your local repository (this is useful when
collaborating with other developers):

```bash
git pull origin dev
```

Then, merge the feature branch into the `dev` branch:

```bash
git merge auth-setup
```

Finally, push your changes to the development branch to the remote repository:

```bash
git push origin dev
```