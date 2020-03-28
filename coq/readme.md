## Coq Tactics Index

Stage 1 Proving Easy Goals
reflexivity
assumption
discriminate
constructor

Stage 2 Transforming Your Goal
apply
subst
rewrite
simpl
cut
unfold

Stage 3 Breaking Apart Your Goal
destruct
inversion
induction

Stage 4 Powerful Automatic Tactics
auto
intuition
omega

## reflexivity
Use reflexivity when your goal is to prove that something equals itself.

In this example we will prove that any term x of type Set is equal to itself. After we intro the variable we can prove the goal using reflexivity.

```coq
Lemma everything_is_itself:
  forall x: Set, x = x.
Proof.
  intro.
  reflexivity.
Qed.
```













