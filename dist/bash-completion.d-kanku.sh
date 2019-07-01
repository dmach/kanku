_kanku() {

  COMMANDS="api console db destroy init ip list login logout pfwd rabbit rcomment rguest rhistory rjob rtrigger setup snapshot ssh startui startvm status stopui stopvm up"
  if [ $COMP_CWORD -eq 1 ];then
    COMPREPLY=($(compgen -W "$COMMANDS" "${COMP_WORDS[1]}"))
  fi
}

complete -F _kanku kanku
